const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProjectTask = sequelize.define('ProjectTask', {
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
  stage_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('todo', 'doing', 'done', 'blocked'),
    allowNull: false,
    defaultValue: 'todo'
  },
  assigned_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  order_index: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'project_tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ProjectTask;

