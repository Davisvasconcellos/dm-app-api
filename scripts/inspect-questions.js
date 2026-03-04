
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

async function inspectQuestions() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected.');

    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'event_questions'
      ORDER BY column_name;
    `);

    console.log('Columns in event_questions table:');
    results.forEach(r => console.log(`- ${r.column_name} (${r.data_type}) [Nullable: ${r.is_nullable}] Default: ${r.column_default}`));

  } catch (error) {
    console.error('Fatal:', error);
  } finally {
    await sequelize.close();
  }
}

inspectQuestions();
