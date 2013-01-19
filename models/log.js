/*
 * Class: Log
 * 
 * Constructor: function Log(input)
 *     input = {type, tag, user, desc[, time]}
 *   create a new lob object with input parameter.
 *   if time is not provided, it will be set to current time.
 *
 * Properties
 * ==========
 *
 * type - the log's type, eg Access, Archive, etc.
 * tag  - indicates the log's sub type, eg New Entry of type Archive
 * user - the user who performed the operation
 * desc - more detailed description
 * time - time of this logs
 *
 * Methods
 * ========
 *  
 * toJSON()         - parse this object into JSON for database insertion
 * store()          - store this object in database collection logs
 * render(renderer) - parse this object into html code for display. requires a Renderer object.
 */
 
var toJSON = function(){
  return {
  'type': this.type,
  'tag': this.tag,
  'user': this.user,
  'desc': this.desc,
  'time': this.time  
  };
}
 
var store = function(){
  this.db.insert('log', this.toJSON(), function(err){
    
  });
}

var render = function(renderer){
  return renderer.article_log(this);
}

function Log(input){
  this.type = input.type;
  this.tag = input.tag;
  this.user = input.user;
  this.desc = input.desc;
  if (input.time)
    this.time = input.time;
  else
    this.time = new Date();
  this.db = new require('../models/db')();
  this.store = store;
  this.toJSON = toJSON;
  this.render = render;
}

module.exports = Log;