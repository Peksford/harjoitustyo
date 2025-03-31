const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class GroupMember extends Model {}

GroupMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'groups', key: 'id' },
      onDelete: 'CASCADE',
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
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
    modelName: 'group_member',
  }
);

module.exports = GroupMember;
