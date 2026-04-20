'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      const dialect = queryInterface.sequelize.getDialect();
      if (dialect !== 'postgres') return;

      await queryInterface.createTable('event_jam_song_likes', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        id_code: { type: Sequelize.UUID, allowNull: false, unique: true, defaultValue: Sequelize.UUIDV4 },
        jam_song_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'event_jam_songs', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        event_guest_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'event_guests', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        liked: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
      }, { transaction: t });

      await queryInterface.addIndex('event_jam_song_likes', ['jam_song_id'], { name: 'event_jam_song_likes_song_idx', transaction: t });
      await queryInterface.addIndex('event_jam_song_likes', ['jam_song_id', 'user_id'], { unique: true, name: 'event_jam_song_likes_song_user_uq', transaction: t });
      await queryInterface.addIndex('event_jam_song_likes', ['jam_song_id', 'event_guest_id'], { unique: true, name: 'event_jam_song_likes_song_guest_uq', transaction: t });
      await queryInterface.addIndex('event_jam_song_likes', ['jam_song_id', 'liked'], { name: 'event_jam_song_likes_song_liked_idx', transaction: t });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      const dialect = queryInterface.sequelize.getDialect();
      if (dialect !== 'postgres') return;
      await queryInterface.dropTable('event_jam_song_likes', { transaction: t });
    });
  }
};

