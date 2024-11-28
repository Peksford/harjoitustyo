const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('albums', 'discogs_id', {
      type: DataTypes.INTEGER,
      default: false,
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('albums', 'discogs_id');
  },
};
