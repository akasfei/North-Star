/*
 * database initialization
 */
function Init(callback) {
  var Db = require('../models/db');
  var db = new Db();
  require('mongodb').connect(db.generate_mongo_url(), function(err, conn){
    if (!conn)
    {
      console.log('Warning. Database unreachable.');
      return callback({err: 'Database unreachable.'});
    }
    conn.collection('access', function(err, coll){
      if (!coll)
      {
        console.log('Warning. Unable to access database collection.');
        return callback({err: 'Collection unreachable.'});
      }
      coll.findOne( { 'id' : 'Forty Two' }, function (err, doc){
        if (!doc)
        {
          console.log('Error! Root access account not found. Inserting...');
          coll.insert(require('./root'));
        }
        console.log('Initialization complete. Closing mongodb connection.');
        conn.close();
    return callback(null);
      });
    });
  });
};

module.exports = Init;