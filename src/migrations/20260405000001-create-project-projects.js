'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_projects', {
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
      client_name: {
        type: Sequelize.STRING(255),
        allowNull: true
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
        type: Sequelize.ENUM('active', 'paused', 'finished'),
        allowNull: false,
        defaultValue: 'active'
      },
      overhead_multiplier: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 1
      },
      created_by_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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

    await queryInterface.addIndex('project_projects', ['store_id', 'status'], {
      name: 'project_projects_store_status_idx'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('project_projects');
  }
};

