
require('dotenv').config();
const { Sequelize } = require('sequelize');

const databaseUrl = process.env.DATABASE_URL;

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function fixStoreId() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected.');

    // Remove NOT NULL constraint from store_id
    await sequelize.query('ALTER TABLE events ALTER COLUMN store_id DROP NOT NULL;');
    console.log('✅ Removed NOT NULL constraint from store_id.');

  } catch (error) {
    console.error('❌ Failed to fix store_id:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixStoreId();
