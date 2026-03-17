const { sequelize } = require('../config/database');

async function getColumnInfo(tableName, columnName) {
  const [rows] = await sequelize.query(
    `
      SELECT
        data_type,
        udt_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = :tableName
        AND column_name = :columnName
      LIMIT 1
    `,
    { replacements: { tableName, columnName } }
  );
  return rows[0] || null;
}

function isNumericType(columnInfo) {
  if (!columnInfo) return false;
  return (
    columnInfo.data_type === 'bigint' ||
    columnInfo.data_type === 'integer' ||
    columnInfo.udt_name === 'int8' ||
    columnInfo.udt_name === 'int4'
  );
}

async function run() {
  await sequelize.authenticate();

  const dialect = sequelize.getDialect();
  if (dialect !== 'postgres') {
    throw new Error(`Script esperado para Postgres, mas dialect é: ${dialect}`);
  }

  const txTable = 'financial_transactions';

  const categoryIdInfo = await getColumnInfo(txTable, 'category_id');
  const costCenterIdInfo = await getColumnInfo(txTable, 'cost_center_id');
  const partyIdInfo = await getColumnInfo(txTable, 'party_id');

  const needsCategory = isNumericType(categoryIdInfo);
  const needsCostCenter = isNumericType(costCenterIdInfo);
  const needsParty = isNumericType(partyIdInfo);

  if (!needsCategory && !needsCostCenter && !needsParty) {
    return;
  }

  await sequelize.transaction(async (t) => {
    if (needsCategory) {
      await sequelize.query(
        `ALTER TABLE ${txTable} ADD COLUMN IF NOT EXISTS category_id_code VARCHAR(255);`,
        { transaction: t }
      );
      await sequelize.query(
        `
          UPDATE ${txTable} ft
          SET category_id_code = fc.id_code
          FROM financial_categories fc
          WHERE ft.category_id_code IS NULL
            AND ft.category_id IS NOT NULL
            AND fc.id = ft.category_id
        `,
        { transaction: t }
      );
      await sequelize.query(
        `
          UPDATE ${txTable}
          SET category_id_code = CAST(category_id AS TEXT)
          WHERE category_id_code IS NULL
            AND category_id IS NOT NULL
        `,
        { transaction: t }
      );
      await sequelize.query(
        `ALTER TABLE ${txTable} RENAME COLUMN category_id TO category_id_int;`,
        { transaction: t }
      );
      await sequelize.query(
        `ALTER TABLE ${txTable} RENAME COLUMN category_id_code TO category_id;`,
        { transaction: t }
      );
    }

    if (needsCostCenter) {
      await sequelize.query(
        `ALTER TABLE ${txTable} ADD COLUMN IF NOT EXISTS cost_center_id_code VARCHAR(255);`,
        { transaction: t }
      );
      await sequelize.query(
        `
          UPDATE ${txTable} ft
          SET cost_center_id_code = fcc.id_code
          FROM financial_cost_centers fcc
          WHERE ft.cost_center_id_code IS NULL
            AND ft.cost_center_id IS NOT NULL
            AND fcc.id = ft.cost_center_id
        `,
        { transaction: t }
      );
      await sequelize.query(
        `
          UPDATE ${txTable}
          SET cost_center_id_code = CAST(cost_center_id AS TEXT)
          WHERE cost_center_id_code IS NULL
            AND cost_center_id IS NOT NULL
        `,
        { transaction: t }
      );
      await sequelize.query(
        `ALTER TABLE ${txTable} RENAME COLUMN cost_center_id TO cost_center_id_int;`,
        { transaction: t }
      );
      await sequelize.query(
        `ALTER TABLE ${txTable} RENAME COLUMN cost_center_id_code TO cost_center_id;`,
        { transaction: t }
      );
    }

    if (needsParty) {
      await sequelize.query(
        `ALTER TABLE ${txTable} ADD COLUMN IF NOT EXISTS party_id_code VARCHAR(255);`,
        { transaction: t }
      );
      await sequelize.query(
        `
          UPDATE ${txTable} ft
          SET party_id_code = fp.id_code
          FROM financial_parties fp
          WHERE ft.party_id_code IS NULL
            AND ft.party_id IS NOT NULL
            AND fp.id = ft.party_id
        `,
        { transaction: t }
      );
      await sequelize.query(
        `
          UPDATE ${txTable}
          SET party_id_code = CAST(party_id AS TEXT)
          WHERE party_id_code IS NULL
            AND party_id IS NOT NULL
        `,
        { transaction: t }
      );
      await sequelize.query(
        `ALTER TABLE ${txTable} RENAME COLUMN party_id TO party_id_int;`,
        { transaction: t }
      );
      await sequelize.query(
        `ALTER TABLE ${txTable} RENAME COLUMN party_id_code TO party_id;`,
        { transaction: t }
      );
    }
  });
}

run()
  .then(async () => {
    await sequelize.close();
  })
  .catch(async (error) => {
    console.error('Erro ao normalizar FKs de financial_transactions:', error);
    try {
      await sequelize.close();
    } catch (e) {
    }
    process.exitCode = 1;
  });

