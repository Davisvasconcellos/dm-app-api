'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Alter project_time_entries.minutes
    await queryInterface.changeColumn('project_time_entries', 'minutes', {
      type: Sequelize.DECIMAL(15, 6),
      allowNull: true
    });

    // Alter project_stages.total_minutes
    await queryInterface.changeColumn('project_stages', 'total_minutes', {
      type: Sequelize.DECIMAL(15, 6),
      allowNull: false,
      defaultValue: 0
    });

    // Alter project_projects.burn_minutes
    await queryInterface.changeColumn('project_projects', 'burn_minutes', {
      type: Sequelize.DECIMAL(15, 6),
      allowNull: false,
      defaultValue: 0
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('project_time_entries', 'minutes', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.changeColumn('project_stages', 'total_minutes', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('project_projects', 'burn_minutes', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  }
};
