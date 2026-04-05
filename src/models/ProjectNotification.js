const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProjectNotification = sequelize.define('ProjectNotification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_code: {
    type: DataTypes.STRING(36),
    allowNull: false,
    unique: true,
    defaultValue: DataTypes.UUIDV4
  },
  store_id: {
    type: DataTypes.STRING(36),
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  dedupe_key: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('unread', 'read', 'dismissed', 'resolved'),
    allowNull: false,
    defaultValue: 'unread'
  },
  payload: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'project_notifications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ProjectNotification;

