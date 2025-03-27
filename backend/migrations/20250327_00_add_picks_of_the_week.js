const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('albums', 'pick_of_the_week', {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    });
    await queryInterface.addColumn('movies', 'pick_of_the_week', {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    });
    await queryInterface.addColumn('books', 'pick_of_the_week', {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    });
    await queryInterface.addColumn('games', 'pick_of_the_week', {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('albums', 'pick_of_the_week');
    await queryInterface.removeColumn('movies', 'pick_of_the_week');
    await queryInterface.removeColumn('books', 'pick_of_the_week');
    await queryInterface.removeColumn('games', 'pick_of_the_week');
  },
};
