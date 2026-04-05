'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_sessions', {
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
      check_in_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      check_out_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      source: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      device_id: {
        type: Sequelize.STRING(255),
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

    await queryInterface.addIndex('project_sessions', ['store_id', 'user_id', 'check_out_at'], {
      name: 'project_sessions_store_user_open_idx'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('project_sessions');
  }
};

