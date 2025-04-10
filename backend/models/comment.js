const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    comment: {
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
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'comment',
  }
);

module.exports = Comment;
