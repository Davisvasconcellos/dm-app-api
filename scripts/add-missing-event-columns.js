
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

async function addMissingColumns() {
  console.log('Starting script...');
  try {
    await sequelize.authenticate();
    console.log('✅ Connected.');

    const columnsToAdd = [
        { name: 'public_url', type: 'VARCHAR(500)' },
        { name: 'gallery_url', type: 'VARCHAR(500)' },
        { name: 'place', type: 'VARCHAR(255)' },
        { name: 'resp_email', type: 'VARCHAR(255)' },
        { name: 'resp_name', type: 'VARCHAR(255)' },
        { name: 'resp_phone', type: 'VARCHAR(20)' },
        { name: 'color_1', type: 'VARCHAR(50)' },
        { name: 'color_2', type: 'VARCHAR(50)' },
        { name: 'card_background', type: 'VARCHAR(255)' },
        { name: 'card_background_type', type: 'SMALLINT DEFAULT 0' },
        { name: 'auto_checkin', type: 'BOOLEAN DEFAULT false' },
        { name: 'requires_auto_checkin', type: 'BOOLEAN DEFAULT false' },
        { name: 'auto_checkin_flow_quest', type: 'BOOLEAN DEFAULT false' },
        { name: 'checkin_component_config', type: 'JSON' }
    ];

    for (const col of columnsToAdd) {
        console.log(`Processing ${col.name}...`);
        try {
            await sequelize.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};`);
            console.log(`✅ Column ${col.name} checked/added.`);
            await new Promise(r => setTimeout(r, 500)); // Add delay
        } catch (e) {
            console.error(`❌ Failed to add ${col.name}:`, e.message);
        }
    }
    console.log('Loop finished.');

  } catch (error) {
    console.error('Fatal:', error);
  } finally {
    await sequelize.close();
  }
}

addMissingColumns();
