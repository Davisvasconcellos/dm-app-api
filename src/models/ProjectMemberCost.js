const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProjectMemberCost = sequelize.define('ProjectMemberCost', {
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
  hourly_rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  overhead_multiplier: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 1
  },
  daily_auto_cutoff_time: {
    type: DataTypes.TIME,
    allowNull: true,
    defaultValue: '18:00:00'
  },
  timezone: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'America/Sao_Paulo'
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'project_member_costs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ProjectMemberCost;
