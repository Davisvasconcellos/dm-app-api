const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProjectSession = sequelize.define('ProjectSession', {
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
  check_in_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  check_out_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  check_out_source: {
    type: DataTypes.ENUM('user', 'auto'),
    allowNull: true
  },
  check_out_reason: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  source: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  device_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'project_sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ProjectSession;
