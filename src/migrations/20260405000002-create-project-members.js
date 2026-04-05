'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_members', {
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
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'project_projects', key: 'id' },
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
      role: {
        type: Sequelize.ENUM('manager', 'member', 'viewer'),
        allowNull: false,
        defaultValue: 'member'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      hourly_rate_override: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      overhead_multiplier_override: {
        type: Sequelize.DECIMAL(5, 2),
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

    await queryInterface.addIndex('project_members', ['project_id', 'status'], {
      name: 'project_members_project_status_idx'
    });

    await queryInterface.addIndex('project_members', ['user_id', 'status'], {
      name: 'project_members_user_status_idx'
    });

    await queryInterface.addIndex('project_members', ['project_id', 'user_id'], {
      unique: true,
      name: 'project_members_project_user_uq'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('project_members');
  }
};

