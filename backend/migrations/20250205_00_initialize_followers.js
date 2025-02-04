const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('follows', {
      follower_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      followed_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });
    await queryInterface.addConstraint('follows', {
      fields: ['follower_id', 'followed_id'],
      type: 'unique',
      name: 'follower_followed_pair',
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('follows');
  },
};
