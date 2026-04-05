'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_time_entries', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_code: {
        type: Sequelize.STRING(36),
        allowNull: false,
        unique: true
      },
      store_id: {
        type: Sequelize.STRING(36),
        allowNull: false
      },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'project_sessions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'project_projects', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      stage_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'project_stages', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'project_tasks', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      status: {
        type: Sequelize.ENUM('running', 'closed'),
        allowNull: false,
        defaultValue: 'running'
      },
      start_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      minutes: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      hourly_rate_snapshot: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      overhead_multiplier_snapshot: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      cost_amount_snapshot: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('project_time_entries', ['store_id', 'user_id', 'status'], {
      name: 'project_time_entries_store_user_status_idx'
    });
    await queryInterface.addIndex('project_time_entries', ['project_id', 'start_at'], {
      name: 'project_time_entries_project_start_idx'
    });
    await queryInterface.addIndex('project_time_entries', ['stage_id', 'start_at'], {
      name: 'project_time_entries_stage_start_idx'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('project_time_entries');
  }
};

