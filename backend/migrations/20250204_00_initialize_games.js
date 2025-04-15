const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('games', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      release_date: {
        type: DataTypes.TEXT,
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
      genres: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      heart: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      involved_companies: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      igdb_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });

    await queryInterface.addColumn('games', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    });

    await queryInterface.addIndex('games', ['whole_title', 'user_id', 'year'], {
      unique: true,
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('games');
    await queryInterface.dropTable('users');
  },
};
