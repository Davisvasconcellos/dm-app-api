const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT || 'postgres',
  logging: console.log,
});

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    console.log('Adding updated_at column to event_jam_song_candidates...');
    await sequelize.query(`
      ALTER TABLE event_jam_song_candidates 
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    `);
    
    console.log('Column added successfully.');
  } catch (error) {
    console.error('Error adding column:', error);
  } finally {
    await sequelize.close();
  }
}

run();
