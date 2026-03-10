const { sequelize } = require('../config/database');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    console.log('Adding city and address columns to stores table...');
    
    // Add city
    await sequelize.query(`
      ALTER TABLE stores 
      ADD COLUMN IF NOT EXISTS city VARCHAR(255);
    `);

    // Add address (generic/full address field)
    await sequelize.query(`
      ALTER TABLE stores 
      ADD COLUMN IF NOT EXISTS address VARCHAR(500);
    `);

    console.log('Columns added successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

run();
