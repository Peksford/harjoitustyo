const Album = require('./album');
const User = require('./user');

User.hasMany(Album, { foreignKey: 'user_id' });
Album.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { Album, User };
