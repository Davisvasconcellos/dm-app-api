'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      const dialect = queryInterface.sequelize.getDialect();
      if (dialect !== 'postgres') return;

      await queryInterface.addColumn(
        'project_projects',
        'logo_url',
        { type: Sequelize.STRING(500), allowNull: true },
        { transaction: t }
      );
      await queryInterface.addColumn(
        'project_projects',
        'responsible_name',
        { type: Sequelize.STRING(255), allowNull: true },
        { transaction: t }
      );
      await queryInterface.addColumn(
        'project_projects',
        'client_party_id',
        { type: Sequelize.STRING(255), allowNull: true },
        { transaction: t }
      );
      await queryInterface.addColumn(
        'project_projects',
        'start_date',
        { type: Sequelize.DATEONLY, allowNull: true },
        { transaction: t }
      );
      await queryInterface.addColumn(
        'project_projects',
        'end_date',
        { type: Sequelize.DATEONLY, allowNull: true },
        { transaction: t }
      );

      await queryInterface.addIndex(
        'project_projects',
        ['store_id', 'client_party_id'],
        { name: 'project_projects_store_client_party_idx', transaction: t }
      );

      await queryInterface.addColumn(
        'project_stages',
        'color_1',
        { type: Sequelize.STRING(20), allowNull: true },
        { transaction: t }
      );
      await queryInterface.addColumn(
        'project_stages',
        'color_2',
        { type: Sequelize.STRING(20), allowNull: true },
        { transaction: t }
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      const dialect = queryInterface.sequelize.getDialect();
      if (dialect !== 'postgres') return;

      await queryInterface.removeColumn('project_stages', 'color_2', { transaction: t });
      await queryInterface.removeColumn('project_stages', 'color_1', { transaction: t });
      await queryInterface.removeIndex('project_projects', 'project_projects_store_client_party_idx', { transaction: t });
      await queryInterface.removeColumn('project_projects', 'end_date', { transaction: t });
      await queryInterface.removeColumn('project_projects', 'start_date', { transaction: t });
      await queryInterface.removeColumn('project_projects', 'client_party_id', { transaction: t });
      await queryInterface.removeColumn('project_projects', 'responsible_name', { transaction: t });
      await queryInterface.removeColumn('project_projects', 'logo_url', { transaction: t });
    });
  }
};

