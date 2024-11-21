var Discogs = require('disconnect').Client;
// const app = express();
require('dotenv').config();

console.log('hehaeshafseh');

// var db = new Discogs().database();
// db.getRelease(176126, function (err, data) {
//   console.log(data);
// });

var dis = new Discogs({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
});

const db = dis.database();

console.log('test', dis.database());

db.search('beatles - a hard days night', function (err, data) {
  console.log(data.results[0]);
});
