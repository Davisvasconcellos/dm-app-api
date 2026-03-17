const { sequelize } = require('../config/database');
const fs = require('fs/promises');
const path = require('path');

function normalizeTableName(tableNameValue) {
  if (!tableNameValue) return null;
  if (typeof tableNameValue === 'string') return tableNameValue;
  if (typeof tableNameValue === 'object') {
    if (tableNameValue.tableName) return tableNameValue.tableName;
    if (tableNameValue.table) return tableNameValue.table;
  }
  return String(tableNameValue);
}

async function tableExists(tableName) {
  const [rows] = await sequelize.query(
    `
      SELECT 1 AS ok
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = :tableName
      LIMIT 1
    `,
    { replacements: { tableName } }
  );
  return rows.length > 0;
}

async function getColumnsWithTypes(tableName) {
  const [rows] = await sequelize.query(
    `
      SELECT
        column_name,
        data_type,
        udt_name,
        is_nullable,
        character_maximum_length
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = :tableName
      ORDER BY ordinal_position ASC
    `,
    { replacements: { tableName } }
  );
  return rows;
}

function getExpectedColumnsFromModel(model) {
  const attrs = model && model.rawAttributes ? model.rawAttributes : {};
  const expected = new Map();
  Object.values(attrs).forEach((attr) => {
    const field = attr.field || attr.fieldName;
    if (!field) return;
    expected.set(field, {
      allowNull: attr.allowNull !== undefined ? attr.allowNull : true,
      unique: !!attr.unique,
      primaryKey: !!attr.primaryKey,
      type: attr.type ? attr.type.constructor?.name || attr.type.key || 'UNKNOWN' : 'UNKNOWN',
      typeKey: attr.type ? attr.type.key : null,
      typeOptions: attr.type && attr.type.options ? attr.type.options : null
    });
  });
  return expected;
}

function mapExpectedSqlType(expectedMeta) {
  const key = expectedMeta.typeKey;
  const opts = expectedMeta.typeOptions || {};

  if (key === 'STRING') {
    const len = typeof opts.length === 'number' ? opts.length : null;
    return `VARCHAR(${len || 255})`;
  }
  if (key === 'TEXT') return 'TEXT';
  if (key === 'INTEGER') return 'INTEGER';
  if (key === 'BIGINT') return 'BIGINT';
  if (key === 'BOOLEAN') return 'BOOLEAN';
  if (key === 'DATEONLY') return 'DATE';
  if (key === 'DATE') return 'TIMESTAMPTZ';
  if (key === 'DECIMAL') {
    const precision = typeof opts.precision === 'number' ? opts.precision : 10;
    const scale = typeof opts.scale === 'number' ? opts.scale : 2;
    return `DECIMAL(${precision},${scale})`;
  }
  if (key === 'JSON' || key === 'JSONB') return 'JSONB';
  if (key === 'ENUM') return 'VARCHAR(255)';
  return 'VARCHAR(255)';
}

function buildAddColumnSql(tableName, columnName, expectedMeta) {
  const sqlType = mapExpectedSqlType(expectedMeta);
  const nullSql = expectedMeta.allowNull === false ? 'NOT NULL' : '';
  const defaultSql =
    columnName === 'created_at' || columnName === 'updated_at'
      ? "DEFAULT NOW()"
      : '';
  return `ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS ${columnName} ${sqlType} ${defaultSql} ${nullSql};`.replace(/\s+/g, ' ').trim();
}

function buildSuggestedSql(tableName, missingColumns, expectedMap) {
  const statements = [];
  missingColumns.forEach((col) => {
    const meta = expectedMap.get(col);
    if (!meta) return;
    statements.push(buildAddColumnSql(tableName, col, meta));
  });

  if (missingColumns.includes('id_code')) {
    statements.push(
      `CREATE UNIQUE INDEX IF NOT EXISTS ${tableName}_id_code_uq ON ${tableName} (id_code);`
    );
  }

  if (missingColumns.includes('store_id')) {
    statements.push(
      `CREATE INDEX IF NOT EXISTS ${tableName}_store_id_idx ON ${tableName} (store_id);`
    );
  }

  if (missingColumns.includes('status')) {
    statements.push(
      `CREATE INDEX IF NOT EXISTS ${tableName}_store_status_idx ON ${tableName} (store_id, status);`
    );
  }

  return statements;
}

async function auditModel(modelName, model, extraExpected = null) {
  const tableName = normalizeTableName(typeof model.getTableName === 'function' ? model.getTableName() : model.tableName);
  const exists = await tableExists(tableName);

  const expectedMap = getExpectedColumnsFromModel(model);
  if (extraExpected) {
    Object.entries(extraExpected).forEach(([col, meta]) => {
      expectedMap.set(col, meta);
    });
  }

  const expectedColumns = Array.from(expectedMap.keys()).sort();

  if (!exists) {
    return {
      modelName,
      tableName,
      exists,
      expectedColumns,
      actualColumns: [],
      missingColumns: expectedColumns,
      extraColumns: [],
      suggestedSql: []
    };
  }

  const columnsWithTypes = await getColumnsWithTypes(tableName);
  const actualColumns = columnsWithTypes.map((c) => c.column_name);

  const missingColumns = expectedColumns.filter((col) => !actualColumns.includes(col));
  const extraColumns = actualColumns.filter((col) => !expectedMap.has(col));

  const suggestedSql = buildSuggestedSql(tableName, missingColumns, expectedMap);

  return {
    modelName,
    tableName,
    exists,
    expectedColumns,
    actualColumns,
    missingColumns,
    extraColumns,
    actualColumnsWithTypes: columnsWithTypes,
    suggestedSql
  };
}

async function run() {
  await sequelize.authenticate();

  const dialect = sequelize.getDialect();
  if (dialect !== 'postgres') {
    throw new Error(`Script esperado para Postgres, mas dialect é: ${dialect}`);
  }

  const models = require('../models');

  const targets = [
    { name: 'FinancialTransaction', model: models.FinancialTransaction },
    { name: 'FinCategory', model: models.FinCategory },
    { name: 'FinCostCenter', model: models.FinCostCenter },
    { name: 'FinTag', model: models.FinTag },
    { name: 'Party', model: models.Party },
    { name: 'BankAccount', model: models.BankAccount },
    { name: 'FinRecurrence', model: models.FinRecurrence }
  ];

  const reports = [];
  for (const t of targets) {
    reports.push(await auditModel(t.name, t.model));
  }

  const joinTableName = 'financial_transaction_tags';
  const joinExists = await tableExists(joinTableName);
  const joinActual = joinExists ? await getColumnsWithTypes(joinTableName) : [];
  const joinExpected = ['transaction_id', 'tag_id', 'created_at', 'updated_at'];
  const joinActualNames = joinActual.map((c) => c.column_name);
  const joinMissing = joinExpected.filter((c) => !joinActualNames.includes(c));

  const output = {
    dialect,
    timestamp: new Date().toISOString(),
    reports: reports.map((r) => ({
      model: r.modelName,
      table: r.tableName,
      exists: r.exists,
      missing_columns: r.missingColumns,
      extra_columns: r.extraColumns
    })),
    join_table: {
      table: joinTableName,
      exists: joinExists,
      missing_columns: joinMissing,
      extra_columns: joinActualNames.filter((c) => !joinExpected.includes(c))
    },
    suggested_sql: [
      ...reports.flatMap((r) => (r.suggestedSql && r.suggestedSql.length ? r.suggestedSql : [])),
      ...(joinMissing.length
        ? [
            `ALTER TABLE ${joinTableName} ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(255) NOT NULL;`,
            `ALTER TABLE ${joinTableName} ADD COLUMN IF NOT EXISTS tag_id VARCHAR(255) NOT NULL;`,
            `ALTER TABLE ${joinTableName} ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();`,
            `ALTER TABLE ${joinTableName} ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();`
          ]
        : [])
    ]
  };

  const outputPath = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.resolve(process.cwd(), 'financial_schema_audit.json');

  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
}

run()
  .then(async () => {
    await sequelize.close();
  })
  .catch(async (error) => {
    console.error('Erro ao auditar schema financeiro:', error);
    try {
      await sequelize.close();
    } catch (e) {
    }
    process.exitCode = 1;
  });
