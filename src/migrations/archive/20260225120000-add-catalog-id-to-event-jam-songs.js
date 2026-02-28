'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('event_jam_songs', 'catalog_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'event_jam_music_catalog',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('event_jam_songs', 'catalog_id');
  }
};
