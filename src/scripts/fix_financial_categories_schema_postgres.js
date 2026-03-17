const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

async function getColumns(tableName) {
  const [rows] = await sequelize.query(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = :tableName
    `,
    { replacements: { tableName } }
  );
  return new Set(rows.map((r) => r.column_name));
}

async function getPrimaryKeyColumn(tableName) {
  const [rows] = await sequelize.query(
    `
      SELECT kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
       AND tc.table_schema = kcu.table_schema
      WHERE tc.table_schema = 'public'
        AND tc.table_name = :tableName
        AND tc.constraint_type = 'PRIMARY KEY'
      ORDER BY kcu.ordinal_position ASC
      LIMIT 1
    `,
    { replacements: { tableName } }
  );
  return rows[0]?.column_name || null;
}

async function ensureColumn(tableName, columnName, sqlType, options = {}) {
  const { defaultValueSql, allowNull = true } = options;
  const cols = await getColumns(tableName);
  if (cols.has(columnName)) return;

  const nullSql = allowNull ? '' : 'NOT NULL';
  const defaultSql = defaultValueSql ? `DEFAULT ${defaultValueSql}` : '';
  await sequelize.query(
    `ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS ${columnName} ${sqlType} ${defaultSql} ${nullSql};`
  );
}

async function ensureUniqueIndex(tableName, indexName, columns) {
  await sequelize.query(
    `CREATE UNIQUE INDEX IF NOT EXISTS ${indexName} ON ${tableName} (${columns.join(', ')});`
  );
}

async function populateIdCode(tableName, pkColumn) {
  if (!pkColumn) {
    throw new Error(`Não foi possível detectar a PK de ${tableName}`);
  }

  const [rows] = await sequelize.query(
    `
      SELECT ${pkColumn} AS pk
      FROM ${tableName}
      WHERE id_code IS NULL OR id_code = ''
    `
  );

  for (const row of rows) {
    const idCode = `cat-${uuidv4()}`;
    await sequelize.query(
      `UPDATE ${tableName} SET id_code = :idCode WHERE ${pkColumn} = :pk;`,
      { replacements: { idCode, pk: row.pk } }
    );
  }
}

async function run() {
  await sequelize.authenticate();

  const dialect = sequelize.getDialect();
  if (dialect !== 'postgres') {
    throw new Error(`Script esperado para Postgres, mas dialect é: ${dialect}`);
  }

  const tableName = 'financial_categories';

  await ensureColumn(tableName, 'id_code', 'VARCHAR(255)', { allowNull: true });
  await ensureColumn(tableName, 'created_at', 'TIMESTAMPTZ', { defaultValueSql: 'NOW()', allowNull: true });
  await ensureColumn(tableName, 'updated_at', 'TIMESTAMPTZ', { defaultValueSql: 'NOW()', allowNull: true });

  const pkColumn = await getPrimaryKeyColumn(tableName);
  await populateIdCode(tableName, pkColumn);
  await ensureUniqueIndex(tableName, 'financial_categories_id_code_uq', ['id_code']);

  await sequelize.query(
    `UPDATE ${tableName} SET created_at = NOW() WHERE created_at IS NULL;`
  );
  await sequelize.query(
    `UPDATE ${tableName} SET updated_at = NOW() WHERE updated_at IS NULL;`
  );
}

run()
  .then(async () => {
    await sequelize.close();
  })
  .catch(async (error) => {
    console.error('Erro ao ajustar schema de financial_categories:', error);
    try {
      await sequelize.close();
    } catch (e) {
    }
    process.exitCode = 1;
  });

