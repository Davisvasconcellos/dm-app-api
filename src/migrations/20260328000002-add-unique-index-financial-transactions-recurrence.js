'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const sequelize = queryInterface.sequelize;
    const dialect = sequelize.getDialect();
    if (dialect !== 'postgres') return;

    await sequelize.transaction(async (t) => {
      await sequelize.query(
        `
          WITH ranked AS (
            SELECT
              ctid,
              row_number() OVER (
                PARTITION BY store_id, recurrence_id, due_date
                ORDER BY created_at ASC
              ) AS rn
            FROM financial_transactions
            WHERE recurrence_id IS NOT NULL
              AND is_deleted = FALSE
          )
          UPDATE financial_transactions ft
          SET is_deleted = TRUE
          FROM ranked r
          WHERE ft.ctid = r.ctid
            AND r.rn > 1;
        `,
        { transaction: t }
      );

      await sequelize.query(
        `
          CREATE UNIQUE INDEX IF NOT EXISTS financial_transactions_recurrence_due_uq
          ON financial_transactions (store_id, recurrence_id, due_date)
          WHERE recurrence_id IS NOT NULL AND is_deleted = FALSE;
        `,
        { transaction: t }
      );
    });
  },

  async down(queryInterface) {
    const sequelize = queryInterface.sequelize;
    const dialect = sequelize.getDialect();
    if (dialect !== 'postgres') return;

    await sequelize.query(
      `DROP INDEX IF EXISTS financial_transactions_recurrence_due_uq;`
    );
  }
};

