const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const StoreInvite = sequelize.define('StoreInvite', {
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
  },
  invited_email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  invited_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('manager', 'collaborator', 'viewer'),
    allowNull: false,
    defaultValue: 'collaborator'
  },
  permissions: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'revoked', 'expired'),
    allowNull: false,
    defaultValue: 'pending'
  },
  token_hash: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  accepted_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  accepted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  revoked_by_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  revoked_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_by_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'store_invites',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = StoreInvite;

