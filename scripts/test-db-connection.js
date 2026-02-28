require('dotenv').config();
const { Sequelize } = require('sequelize');

async function test() {
  const url = process.env.DATABASE_URL;
  console.log('Testing connection to:', url ? url.replace(/:[^:@]*@/, ':****@') : 'No URL provided');

  if (!url) {
    console.error('❌ DATABASE_URL is missing!');
    return;
  }

  const sequelize = new Sequelize(url, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

test();
