'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_member_costs', {
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
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      hourly_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      overhead_multiplier: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 1
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATEONLY,
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

    await queryInterface.addIndex('project_member_costs', ['store_id', 'user_id', 'start_date'], {
      name: 'project_member_costs_store_user_start_idx'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('project_member_costs');
  }
};

