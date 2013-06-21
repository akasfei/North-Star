/*
 * Class Db
 * Or is it Class Mongo? LOL
 *
 * Constructor function Mongo()
 *   create a db instance with either cloudfoundry mongodb configurations
 *   or default localhost configurations
 *
 * Properties
 * ==========
 *
 *   hostname - hostname of the database server
 *   port     - port of the database server
 *   username - *
 *   password - *
 *   name     - *
 *   db       - name of the database
 *
 * Methods
 * =======
 *
 * generate_mongo_url() - generate database url based on db configuration
 *
 * generate_ObjectId() - generate an objectid from an objectId string
 *
 * find_and_render(type, collection, query, sort, limit, callback, renderer, admin)
 *  - find and items matching query param, then return html string created by renderer
 *   type - the templete the renderer's going to use
 *   collection - the db collection to perform the query
 *   sort - how to sort the database cursor
 *   limit - how many results are needed. 0 means unlimited.
 *   callback - the callback function
 *   renderer - the renderer this method should use to create html string
 *   admin - whether to render admin-only html strings
 *
 * findOne(collection, query, callback)
 *  - find the first item matching the query param.
 *
 * update(collection, query, data, override, callback)
 *  - update the item matching query param. Will create one if no item is found.
 *   data - the data to be used in updating
 *   override - whether the item should be completly replaced by data object
 *
 * insert(collection, data, callback)
 *  - insert data object in db collection
 *
 * remove(collection, query, callback)
 *  - remove items matching the query param
 *
 */


var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');

var generate_mongo_url = function(){
  return this.mongourl;
  /*if(this.username && this.password){
    return "mongodb://" + this.username + ":" + this.password + "@" + this.hostname + ":" + this.port + "/" + this.db;
  }
  else{
    return "mongodb://" + this.hostname + ":" + this.port + "/" + this.db;
  }*/
}

var Log = require('../models/log');

var find_and_render = function(type, collection, query, sort, limit, callback, renderer, admin){
  require('mongodb').connect(this.generate_mongo_url(), function(err, conn){
    if (!conn)
      return callback('Error: No open connections');
    if (err)
      return callback(err.stack);
    conn.collection(collection, function(err, coll){
      coll.find(query/*{ 'accesslevel' : {$lte : '1'} }*/, function(err, cursor){
        var contents = '';
        if (cursor) {
          cursor.sort(sort/*{'time': 1}*/);
      cursor.limit(limit);
          cursor.each(function(err, entry) {
            if (err)
            {
              contents = '<p>' + err.stack + '</p>';
              return;
            }
            if(entry == null) {
              conn.close();
              if (contents == '')
                contents = renderer.no_entry_found();
              return callback(contents);
            }
      switch (type){
        case 'article_entry':
          contents += renderer.article_entry(entry, admin);
        break;
        case 'article_entry_thumbnail':
          contents += renderer.article_entry_thumbnail(entry, admin);
        break;
          case 'access_entry':
          contents += renderer.access_entry(entry); 
        break;
        case 'access_request_entry':
          contents += renderer.access_request_entry(entry);
        break;
        case 'dropdown_li':
          contents += renderer.dropdown_li(entry.id);
        break;
        case 'log':
          contents += new Log(entry).render(renderer);
        break;
        case 'article_profile':
          contents += renderer.profile_article(entry);
        break;
      }
      });
        }
      });
    });
  });
}

var findOne = function(collection, query, callback){
  require('mongodb').connect(this.generate_mongo_url(), function(err, conn){
    if (err || !conn)
      return callback(typeof err === 'undefined'? err: {err: 'No open connections'}, null);
    conn.collection(collection, function(err, coll){
      coll.findOne(query, function(err, doc){
    conn.close();
    if (err)
      return callback(err, null);
        if (doc)
          return callback(null, doc);
    else
      return callback(null, null);
      });
    });
  });
}

var update = function(collection, query, data, override, callback){
  if (!override)
    data = { $set: data };
  require('mongodb').connect(this.generate_mongo_url(), function(err, conn){
    if (err || !conn)
      return callback(typeof err === 'undefined'? err: {err: 'No open connections'}, null);
    conn.collection(collection, function(err, coll){
      coll.update(query, data, {upsert: true, safe:true}, function(err) {
        conn.close();
    return callback(err);
      });
    });
  });
}

var insert = function(collection, data, callback){
  require('mongodb').connect(this.generate_mongo_url(), function(err, conn){
    if (err || !conn)
      return callback(typeof err === 'undefined'? err: {err: 'No open connections'}, null);
    conn.collection(collection, function(err, coll){
      coll.insert(data, {safe:true}, function(err) {
        conn.close();
    return callback(err);
      });
    });
  });
}

var remove = function (collection, query, callback){
  require('mongodb').connect(this.generate_mongo_url(), function(err, conn){
    if (err || !conn)
      return callback(typeof err === 'undefined'? err: {err: 'No open connections'}, null);
    conn.collection(collection, function(err, coll){
      coll.remove(query);
    conn.close();
    return callback(err);
     });
  });
}

var updateParam = function() {
  var params = {};
  if(process.env.VCAP_SERVICES){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var serviceKey = Object.keys(env)[0];
    params = env[serviceKey][0]['credentials'];
    this.mongourl = env[serviceKey][0].credentials.uri;
    this.db = 'mongolab-7dbf';
  }
  else{
    params = {
      "hostname":"localhost",
      "port":27017,
      "username":"",
      "password":"",
      "name":"",
      "db":"deepearth"
    };
  }
  for (prop in params){
    if (this[prop] != params[prop]){
      this[prop] = params[prop];
      var changed = true;
    }
  }
  if (changed)
    console.log('Database parameter updated. [' + new Date() + ']');
}

function Mongo() {
  this.updateParam = updateParam;
  this.updateParam();
  this.generate_mongo_url = generate_mongo_url;
  this.generate_ObjectId = require('mongodb').BSONPure.ObjectID;
  this.find_and_render = find_and_render;
  this.findOne = findOne;
  this.update = update;
  this.insert = insert;
  this.remove = remove;
  this.ObjectID = require('mongodb').ObjectID;
  return this;
}

module.exports = Mongo;