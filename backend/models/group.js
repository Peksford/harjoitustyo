const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class Group extends Model {}

Group.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discogs_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tmdb_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    book_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    igdb_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    item_type: {
      type: DataTypes.ENUM('album', 'book', 'movie', 'game'),
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'group',
  }
);

module.exports = Group;
