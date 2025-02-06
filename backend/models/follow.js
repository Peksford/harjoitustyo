const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class Follow extends Model {}

Follow.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    follower_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: false,
    },
    followed_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    followed_username: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    follower_username: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'follow',
    paranoid: true,
  }
);

module.exports = Follow;
