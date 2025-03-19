const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('books', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      author: {
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
      thumbnail: {
        type: DataTypes.TEXT,
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
      rating: {
        type: DataTypes.FLOAT,
        allownull: true,
      },
      heart: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      source: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      synopsis: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    });

    await queryInterface.addColumn('books', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    });

    await queryInterface.addIndex('books', ['whole_title', 'user_id', 'year'], {
      unique: true,
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('books');
    await queryInterface.dropTable('users');
  },
};
