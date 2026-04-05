'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_stages', {
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
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'project_projects', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      acronym: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      contract_value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      estimated_hours: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('planned', 'active', 'completed'),
        allowNull: false,
        defaultValue: 'planned'
      },
      completed_at: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex('project_stages', ['project_id', 'order_index'], {
      name: 'project_stages_project_order_idx'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('project_stages');
  }
};

