require('dotenv').config();
const { Sequelize } = require('sequelize');
const { requestContext } = require('../utils/requestContext');

// Database configuration
const dialect = process.env.DB_DIALECT || 'mysql';
const isPostgres = dialect === 'postgres' || !!process.env.DATABASE_URL;

const commonOptions = {
  dialect,
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX) || 15,
    min: parseInt(process.env.DB_POOL_MIN) || 2,
    acquire: 10000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  },
  dialectOptions: isPostgres ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {
    charset: 'utf8mb4'
  }
};

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, commonOptions)
  : new Sequelize(
      process.env.DB_NAME || 'beerclub',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        ...commonOptions
      }
    );

// Global query counter for monitoring
sequelize.dbQueries = 0;

// Centralized hook to count all queries from all models globally
sequelize.addHook('beforeQuery', () => {
  sequelize.dbQueries++;
  
  // Attribute query to current request context if available
  const context = requestContext.getStore();
  if (context) {
    context.dbQueries++;
  }
});

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  testConnection
};