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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'album',
  }
);

module.exports = Album;
