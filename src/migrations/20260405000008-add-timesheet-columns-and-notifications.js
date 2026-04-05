'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      const dialect = queryInterface.sequelize.getDialect();
      if (dialect !== 'postgres') return;

      await queryInterface.addColumn(
        'project_sessions',
        'check_out_source',
        { type: Sequelize.ENUM('user', 'auto'), allowNull: true },
        { transaction: t }
      );
      await queryInterface.addColumn(
        'project_sessions',
        'check_out_reason',
        { type: Sequelize.STRING(100), allowNull: true },
        { transaction: t }
      );

      await queryInterface.addColumn(
        'project_member_costs',
        'daily_auto_cutoff_time',
        { type: Sequelize.TIME, allowNull: true, defaultValue: '18:00:00' },
        { transaction: t }
      );
      await queryInterface.addColumn(
        'project_member_costs',
        'timezone',
        { type: Sequelize.STRING(100), allowNull: true, defaultValue: 'America/Sao_Paulo' },
        { transaction: t }
      );

      await queryInterface.createTable(
        'project_notifications',
        {
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
          type: {
            type: Sequelize.STRING(100),
            allowNull: false
          },
          dedupe_key: {
            type: Sequelize.STRING(255),
            allowNull: false
          },
          status: {
            type: Sequelize.ENUM('unread', 'read', 'dismissed', 'resolved'),
            allowNull: false,
            defaultValue: 'unread'
          },
          payload: {
            type: Sequelize.JSONB,
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
        },
        { transaction: t }
      );

      await queryInterface.addIndex(
        'project_notifications',
        ['store_id', 'user_id', 'dedupe_key'],
        { unique: true, name: 'project_notifications_dedupe_uq', transaction: t }
      );
      await queryInterface.addIndex(
        'project_notifications',
        ['store_id', 'user_id', 'status', 'created_at'],
        { name: 'project_notifications_inbox_idx', transaction: t }
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      const dialect = queryInterface.sequelize.getDialect();
      if (dialect !== 'postgres') return;

      await queryInterface.dropTable('project_notifications', { transaction: t });
      await queryInterface.removeColumn('project_member_costs', 'timezone', { transaction: t });
      await queryInterface.removeColumn('project_member_costs', 'daily_auto_cutoff_time', { transaction: t });
      await queryInterface.removeColumn('project_sessions', 'check_out_reason', { transaction: t });
      await queryInterface.removeColumn('project_sessions', 'check_out_source', { transaction: t });
    });
  }
};

