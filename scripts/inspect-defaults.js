
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

async function inspectDefaults() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected.');

    const [results] = await sequelize.query(`
      SELECT column_name, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'events'
      AND column_name IN ('status', 'date')
      ORDER BY column_name;
    `);

    console.log('Defaults:');
    results.forEach(r => console.log(`- ${r.column_name}: Default=${r.column_default}, Nullable=${r.is_nullable}`));

  } catch (error) {
    console.error('Fatal:', error);
  } finally {
    await sequelize.close();
  }
}

inspectDefaults();
