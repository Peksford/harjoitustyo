const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class Album extends Model {}

Album.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    artist: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    whole_title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    discogs_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    heart: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    pick_of_the_week: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'album',
    indexes: [
      {
        unique: true,
        fields: ['discogs_id', 'user_id'],
      },
    ],
  }
);

module.exports = Album;
