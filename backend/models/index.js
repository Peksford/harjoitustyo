const Album = require('./album');
const User = require('./user');

User.hasMany(Album);
Album.belongsTo(User);

module.exports = { Album, User };
