const { sequelize } = require('../config/database');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    console.log('Adding logo_url and banner_url to organizations table...');
    
    // Add logo_url
    await sequelize.query(`
      ALTER TABLE organizations 
      ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500);
    `);

    // Add banner_url
    await sequelize.query(`
      ALTER TABLE organizations 
      ADD COLUMN IF NOT EXISTS banner_url VARCHAR(500);
    `);

    console.log('Columns added successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

run();
