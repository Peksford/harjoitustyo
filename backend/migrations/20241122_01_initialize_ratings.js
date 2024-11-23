const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('albums', 'rating', {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 10,
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('albums', 'rating');
  },
};
