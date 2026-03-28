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
          ALTER TABLE financial_recurrences
          ADD COLUMN IF NOT EXISTS store_id VARCHAR(255);
        `,
        { transaction: t }
      );

      await sequelize.query(
        `
          UPDATE financial_recurrences fr
          SET store_id = s.id_code
          FROM stores s
          WHERE fr.store_id IS NULL
            AND fr.store_id_int IS NOT NULL
            AND fr.store_id_int = s.id;
        `,
        { transaction: t }
      );

      await sequelize.query(
        `
          ALTER TABLE financial_recurrences
          DROP CONSTRAINT IF EXISTS financial_recurrences_store_id_not_null,
          DROP CONSTRAINT IF EXISTS financial_recurrences_store_id_fkey;
        `,
        { transaction: t }
      );

      await sequelize.query(
        `
          ALTER TABLE financial_recurrences
          ALTER COLUMN store_id_int DROP NOT NULL;
        `,
        { transaction: t }
      );

      const fkMigrations = [
        {
          column: 'category_id',
          tempColumn: 'category_id_code',
          sourceTable: 'financial_categories',
          legacyFkNames: ['financial_recurrences_category_id_fkey', 'fk_fin_recurrences_category_id']
        },
        {
          column: 'cost_center_id',
          tempColumn: 'cost_center_id_code',
          sourceTable: 'financial_cost_centers',
          legacyFkNames: ['financial_recurrences_cost_center_id_fkey', 'fk_fin_recurrences_cost_center_id']
        },
        {
          column: 'party_id',
          tempColumn: 'party_id_code',
          sourceTable: 'financial_parties',
          legacyFkNames: ['financial_recurrences_party_id_fkey', 'fk_fin_recurrences_party_id']
        },
        {
          column: 'bank_account_id',
          tempColumn: 'bank_account_id_code',
          sourceTable: 'financial_bank_accounts',
          legacyFkNames: ['financial_recurrences_bank_account_id_fkey', 'fk_fin_recurrences_bank_account_id']
        }
      ];

      for (const cfg of fkMigrations) {
        await sequelize.query(
          `
            ALTER TABLE financial_recurrences
            ADD COLUMN IF NOT EXISTS ${cfg.tempColumn} VARCHAR(255);
          `,
          { transaction: t }
        );

        await sequelize.query(
          `
            UPDATE financial_recurrences fr
            SET ${cfg.tempColumn} = src.id_code
            FROM ${cfg.sourceTable} src
            WHERE fr.${cfg.column} IS NOT NULL
              AND src.id = fr.${cfg.column};
          `,
          { transaction: t }
        );

        for (const fkName of cfg.legacyFkNames) {
          await sequelize.query(
            `ALTER TABLE financial_recurrences DROP CONSTRAINT IF EXISTS ${fkName};`,
            { transaction: t }
          );
        }

        await sequelize.query(
          `ALTER TABLE financial_recurrences DROP COLUMN IF EXISTS ${cfg.column};`,
          { transaction: t }
        );

        await sequelize.query(
          `ALTER TABLE financial_recurrences RENAME COLUMN ${cfg.tempColumn} TO ${cfg.column};`,
          { transaction: t }
        );
      }

      await sequelize.query(
        `
          DO $$
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM financial_recurrences WHERE store_id IS NULL) THEN
              ALTER TABLE financial_recurrences ALTER COLUMN store_id SET NOT NULL;
            END IF;
          END $$;
        `,
        { transaction: t }
      );

      await sequelize.query(
        `
          ALTER TABLE financial_recurrences
          ADD CONSTRAINT financial_recurrences_category_id_code_fkey
            FOREIGN KEY (category_id) REFERENCES financial_categories(id_code) ON DELETE SET NULL,
          ADD CONSTRAINT financial_recurrences_cost_center_id_code_fkey
            FOREIGN KEY (cost_center_id) REFERENCES financial_cost_centers(id_code) ON DELETE SET NULL,
          ADD CONSTRAINT financial_recurrences_party_id_code_fkey
            FOREIGN KEY (party_id) REFERENCES financial_parties(id_code) ON DELETE SET NULL,
          ADD CONSTRAINT financial_recurrences_bank_account_id_code_fkey
            FOREIGN KEY (bank_account_id) REFERENCES financial_bank_accounts(id_code) ON DELETE SET NULL;
        `,
        { transaction: t }
      );

      await sequelize.query(
        `CREATE INDEX IF NOT EXISTS financial_recurrences_store_id_idx ON financial_recurrences (store_id);`,
        { transaction: t }
      );
      await sequelize.query(
        `CREATE INDEX IF NOT EXISTS financial_recurrences_store_status_idx ON financial_recurrences (store_id, status);`,
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
          ALTER TABLE financial_recurrences
          DROP CONSTRAINT IF EXISTS financial_recurrences_category_id_code_fkey,
          DROP CONSTRAINT IF EXISTS financial_recurrences_cost_center_id_code_fkey,
          DROP CONSTRAINT IF EXISTS financial_recurrences_party_id_code_fkey,
          DROP CONSTRAINT IF EXISTS financial_recurrences_bank_account_id_code_fkey;
        `,
        { transaction: t }
      );
    });
  }
};

