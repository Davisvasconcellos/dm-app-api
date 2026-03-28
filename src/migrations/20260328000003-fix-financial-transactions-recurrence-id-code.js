'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const sequelize = queryInterface.sequelize;
    const dialect = sequelize.getDialect();
    if (dialect !== 'postgres') return;

    await sequelize.transaction(async (t) => {
      await sequelize.query(
        `ALTER TABLE financial_transactions ADD COLUMN IF NOT EXISTS recurrence_id_code VARCHAR(255);`,
        { transaction: t }
      );

      await sequelize.query(
        `
          UPDATE financial_transactions ft
          SET recurrence_id_code = fr.id_code
          FROM financial_recurrences fr
          WHERE ft.recurrence_id IS NOT NULL
            AND fr.id = ft.recurrence_id
            AND (ft.recurrence_id_code IS NULL OR ft.recurrence_id_code = '');
        `,
        { transaction: t }
      );

      await sequelize.query(
        `
          ALTER TABLE financial_transactions
          DROP CONSTRAINT IF EXISTS financial_transactions_recurrence_id_fkey,
          DROP CONSTRAINT IF EXISTS fk_fin_transactions_recurrence_id;
        `,
        { transaction: t }
      );

      await sequelize.query(
        `DROP INDEX IF EXISTS financial_transactions_recurrence_due_uq;`,
        { transaction: t }
      );

      await sequelize.query(
        `ALTER TABLE financial_transactions DROP COLUMN IF EXISTS recurrence_id;`,
        { transaction: t }
      );

      await sequelize.query(
        `ALTER TABLE financial_transactions RENAME COLUMN recurrence_id_code TO recurrence_id;`,
        { transaction: t }
      );

      await sequelize.query(
        `
          ALTER TABLE financial_transactions
          ADD CONSTRAINT financial_transactions_recurrence_id_code_fkey
            FOREIGN KEY (recurrence_id) REFERENCES financial_recurrences(id_code) ON DELETE SET NULL;
        `,
        { transaction: t }
      );

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

    await sequelize.transaction(async (t) => {
      await sequelize.query(
        `
          ALTER TABLE financial_transactions
          DROP CONSTRAINT IF EXISTS financial_transactions_recurrence_id_code_fkey;
        `,
        { transaction: t }
      );

      await sequelize.query(
        `DROP INDEX IF EXISTS financial_transactions_recurrence_due_uq;`,
        { transaction: t }
      );
    });
  }
};

