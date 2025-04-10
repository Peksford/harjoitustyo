const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('comments', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addColumn('comments', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    });
    await queryInterface.addColumn('comments', 'group_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'groups', key: 'id' },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('comments');
  },
};
