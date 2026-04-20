const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EventJamSongLike = sequelize.define('EventJamSongLike', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_code: { type: DataTypes.UUID, allowNull: false, unique: true, defaultValue: DataTypes.UUIDV4 },
  jam_song_id: { type: DataTypes.INTEGER, allowNull: false },
  event_guest_id: { type: DataTypes.INTEGER, allowNull: true },
  user_id: { type: DataTypes.INTEGER, allowNull: true },
  liked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  tableName: 'event_jam_song_likes',
  timestamps: false
});

module.exports = EventJamSongLike;

