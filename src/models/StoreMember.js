const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const StoreMember = sequelize.define('StoreMember', {
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
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false
    // References Store model
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true // Can be null if invited by email but not yet registered
  },
  invited_email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('manager', 'collaborator', 'viewer'),
    allowNull: false,
    defaultValue: 'collaborator'
  },
  permissions: {
    type: DataTypes.JSONB, // Array of permission strings e.g. ['finance:read', 'finance:write']
    allowNull: false,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('invited', 'active', 'inactive', 'rejected'),
    allowNull: false,
    defaultValue: 'invited'
  }
}, {
  tableName: 'store_members',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = StoreMember;
