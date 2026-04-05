const { sequelize } = require('../config/database');
const { ProjectNotification } = require('../models');

const safeString = (v) => (v === undefined || v === null) ? '' : String(v);

const createNotificationsForAutoClosedSessions = async (rows) => {
  for (const r of rows) {
    const storeId = safeString(r.store_id);
    const userId = Number(r.user_id);
    const date = safeString(r.local_date);
    const sessionId = safeString(r.session_id_code);
    const cutoffTime = safeString(r.cutoff_time);
    const dedupeKey = `timesheet:auto_close:${storeId}:${userId}:${date}`;

    try {
      await ProjectNotification.create({
        store_id: storeId,
        user_id: userId,
        type: 'timesheet_auto_closed',
        dedupe_key: dedupeKey,
        status: 'unread',
        payload: { date, session_id: sessionId, cutoff_time: cutoffTime }
      });
    } catch (e) {
      if (e && e.name === 'SequelizeUniqueConstraintError') continue;
      throw e;
    }
  }
};

const autoCloseProjectSessionsByCutoff = async () => {
  const [rows] = await sequelize.query(
    `
      WITH base AS (
        SELECT
          s.id AS session_id,
          s.id_code AS session_id_code,
          s.store_id,
          s.user_id,
          COALESCE(cfg.timezone, 'America/Sao_Paulo') AS tz,
          COALESCE(cfg.daily_auto_cutoff_time, '18:00:00'::time) AS cutoff_time
        FROM project_sessions s
        LEFT JOIN LATERAL (
          SELECT mc.timezone, mc.daily_auto_cutoff_time
          FROM project_member_costs mc
          WHERE mc.store_id = s.store_id
            AND mc.user_id = s.user_id
            AND mc.start_date <= (s.check_in_at AT TIME ZONE COALESCE(mc.timezone, 'America/Sao_Paulo'))::date
            AND (mc.end_date IS NULL OR mc.end_date >= (s.check_in_at AT TIME ZONE COALESCE(mc.timezone, 'America/Sao_Paulo'))::date)
          ORDER BY mc.start_date DESC
          LIMIT 1
        ) cfg ON true
        WHERE s.check_out_at IS NULL
      ),
      calc AS (
        SELECT
          b.*,
          (b.cutoff_time)::text AS cutoff_time_text,
          ((s.check_in_at AT TIME ZONE b.tz)::date) AS local_date,
          (((s.check_in_at AT TIME ZONE b.tz)::date)::timestamp + b.cutoff_time) AT TIME ZONE b.tz AS cutoff_at
        FROM base b
        JOIN project_sessions s ON s.id = b.session_id
      ),
      upd AS (
        UPDATE project_sessions s
        SET
          check_out_at = c.cutoff_at,
          check_out_source = 'auto',
          check_out_reason = 'forgotten_checkout',
          updated_at = now()
        FROM calc c
        WHERE s.id = c.session_id
          AND now() >= c.cutoff_at
        RETURNING
          s.id AS session_id,
          s.id_code AS session_id_code,
          s.store_id,
          s.user_id,
          c.local_date AS local_date,
          c.cutoff_time_text AS cutoff_time
      )
      SELECT * FROM upd;
    `
  );

  if (!rows.length) return [];

  const sessionIds = rows.map(r => Number(r.session_id)).filter(Boolean);
  await sequelize.query(
    `
      UPDATE project_time_entries e
      SET
        end_at = s.check_out_at,
        status = 'closed',
        minutes = GREATEST(0, ROUND(EXTRACT(EPOCH FROM (s.check_out_at - e.start_at)) / 60)::int),
        updated_at = now()
      FROM project_sessions s
      WHERE e.session_id = s.id
        AND e.status = 'running'
        AND s.check_out_source = 'auto'
        AND s.check_out_reason = 'forgotten_checkout'
        AND s.id IN (:sessionIds);
    `,
    { replacements: { sessionIds } }
  );

  await createNotificationsForAutoClosedSessions(rows);
  return rows;
};

module.exports = {
  autoCloseProjectSessionsByCutoff
};
