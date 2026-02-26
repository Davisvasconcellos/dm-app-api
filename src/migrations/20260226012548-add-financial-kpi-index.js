'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('financial_transactions', ['store_id', 'status', 'type', 'is_deleted'], {
      name: 'idx_fin_kpi'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('financial_transactions', 'idx_fin_kpi');
  }
};
