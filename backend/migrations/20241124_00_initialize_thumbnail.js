const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('albums', 'thumbnail', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('albums', 'thumbnail');
  },
};
