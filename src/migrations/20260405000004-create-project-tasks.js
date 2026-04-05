'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_tasks', {
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
      stage_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'project_stages', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('todo', 'doing', 'done', 'blocked'),
        allowNull: false,
        defaultValue: 'todo'
      },
      assigned_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      order_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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

    await queryInterface.addIndex('project_tasks', ['stage_id', 'status', 'order_index'], {
      name: 'project_tasks_stage_status_order_idx'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('project_tasks');
  }
};

