const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('books', {
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      whole_title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    });

    await queryInterface.addColumn('books', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    });

    await queryInterface.addIndex('books', ['whole_title', 'user_id'], {
      unique: true,
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('books');
    await queryInterface.dropTable('users');
  },
};