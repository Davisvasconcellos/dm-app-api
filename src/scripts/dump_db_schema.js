const { sequelize } = require('../config/database');
const fs = require('fs');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.\n');

    let output = '--- DATABASE SCHEMA DUMP ---\n';
    
    // Query to get all tables and columns
    const schemaQuery = `
      SELECT 
        table_name, 
        column_name, 
        data_type, 
        is_nullable, 
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `;

    const [results] = await sequelize.query(schemaQuery);

    const tables = {};
    results.forEach(row => {
      if (!tables[row.table_name]) {
        tables[row.table_name] = [];
      }
      tables[row.table_name].push({
        name: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable,
        default: row.column_default
      });
    });

    for (const [tableName, columns] of Object.entries(tables)) {
      output += `\nTABLE: ${tableName}\n`;
      output += '--------------------------------------------------\n';
      columns.forEach(col => {
        let typeStr = col.type;
        if (col.nullable === 'NO') typeStr += ' NOT NULL';
        if (col.default) typeStr += ` DEFAULT ${col.default}`;
        output += `  - ${col.name.padEnd(25)} ${typeStr}\n`;
      });
    }

    output += '\n--- END OF DUMP ---\n';
    
    fs.writeFileSync('schema_dump.txt', output);
    console.log('Dump saved to schema_dump.txt');

  } catch (error) {
    console.error('Error dumping schema:', error.message);
  } finally {
    await sequelize.close();
  }
}

run();


