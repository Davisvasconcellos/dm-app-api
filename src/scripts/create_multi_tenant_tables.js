const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT || 'postgres',
  port: process.env.DB_PORT || 5432,
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // Import Models (Standalone definition to avoid loading full app context)
    const { DataTypes } = require('sequelize');
    const { v4: uuidv4 } = require('uuid');

    // Organization
    const Organization = sequelize.define('Organization', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      id_code: { type: DataTypes.STRING(36), allowNull: false, unique: true, defaultValue: uuidv4 },
      owner_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING(255), allowNull: false },
      document: { type: DataTypes.STRING(50), allowNull: true },
      plan_tier: { type: DataTypes.ENUM('free', 'basic', 'premium', 'enterprise'), allowNull: false, defaultValue: 'free' },
      status: { type: DataTypes.ENUM('active', 'suspended', 'archived'), allowNull: false, defaultValue: 'active' }
    }, { tableName: 'organizations', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

    // Store
    const Store = sequelize.define('Store', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      id_code: { type: DataTypes.STRING(36), allowNull: false, unique: true, defaultValue: uuidv4 },
      organization_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING(255), allowNull: false },
      slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      address: { type: DataTypes.STRING(500), allowNull: true },
      config: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
      status: { type: DataTypes.ENUM('active', 'inactive'), allowNull: false, defaultValue: 'active' }
    }, { tableName: 'stores', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

    // StoreMember
    const StoreMember = sequelize.define('StoreMember', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      id_code: { type: DataTypes.STRING(36), allowNull: false, unique: true, defaultValue: uuidv4 },
      store_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: true },
      invited_email: { type: DataTypes.STRING(255), allowNull: true },
      role: { type: DataTypes.ENUM('manager', 'collaborator', 'viewer'), allowNull: false, defaultValue: 'collaborator' },
      permissions: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      status: { type: DataTypes.ENUM('invited', 'active', 'inactive', 'rejected'), allowNull: false, defaultValue: 'invited' }
    }, { tableName: 'store_members', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

    console.log('Syncing tables...');
    
    // Sync tables individually to ensure order
    await Organization.sync({ alter: true });
    console.log('Organizations table synced.');

    await Store.sync({ alter: true });
    console.log('Stores table synced.');

    await StoreMember.sync({ alter: true });
    console.log('StoreMembers table synced.');

    console.log('All multi-tenant tables created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await sequelize.close();
  }
}

run();
