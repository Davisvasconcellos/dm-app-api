const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Organization = sequelize.define('Organization', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_code: {
    type: DataTypes.STRING(36),
    allowNull: false,
    unique: true,
    defaultValue: uuidv4
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // References User model (defined in index.js associations)
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  document: {
    type: DataTypes.STRING(50), // CNPJ, CPF, EIN, etc.
    allowNull: true
  },
  logo_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  banner_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  plan_tier: {
    type: DataTypes.ENUM('free', 'basic', 'premium', 'enterprise'),
    allowNull: false,
    defaultValue: 'free'
  },
  status: {
    type: DataTypes.ENUM('active', 'suspended', 'archived'),
    allowNull: false,
    defaultValue: 'active'
  }
}, {
  tableName: 'organizations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Organization;
