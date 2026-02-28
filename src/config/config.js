
const path = require('path');
// Load base .env
const result = require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
if (result.error) {
    console.error('Error loading .env:', result.error);
} else {
    console.log('.env loaded successfully');
    console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);
}

// Load environment-specific .env.<NODE_ENV> to override base values
try {
  const env = process.env.NODE_ENV || 'development';
  require('dotenv').config({ path: path.resolve(__dirname, `../../.env.${env}`) });
} catch (e) {
  // Ignore if env-specific file does not exist
}
module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL', // Use DATABASE_URL for Postgres connection
    dialect: 'postgres',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'beerclub_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      charset: 'utf8mb4'
    }
  },
  production: {
    use_env_variable: 'DATABASE_URL', // Use DATABASE_URL for Postgres connection
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
