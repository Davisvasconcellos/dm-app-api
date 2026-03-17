const { sequelize } = require('../config/database');

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

async function run() {
  await sequelize.authenticate();

  const dialect = sequelize.getDialect();
  if (dialect !== 'postgres') {
    throw new Error(`Script esperado para Postgres, mas dialect é: ${dialect}`);
  }

  const tableName = 'financial_categories';

  await ensureColumn(tableName, 'status', 'VARCHAR(20)', { defaultValueSql: `'active'`, allowNull: true });
  await sequelize.query(`UPDATE ${tableName} SET status = 'active' WHERE status IS NULL;`);
  await sequelize.query(`CREATE INDEX IF NOT EXISTS financial_categories_store_status_idx ON ${tableName} (store_id, status);`);
}

run()
  .then(async () => {
    await sequelize.close();
  })
  .catch(async (error) => {
    console.error('Erro ao ajustar coluna status de financial_categories:', error);
    try {
      await sequelize.close();
    } catch (e) {
    }
    process.exitCode = 1;
  });

