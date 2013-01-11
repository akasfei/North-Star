/*
 * Root Administrator
 */
 
var hash = require('crypto').createHash('sha1');
var codehash = hash.update('SFEI_HEART_OPENSOURCE', 'utf8').digest('base64');

module.exports = {
  'codehash' : codehash, 
  'id' : 'Forty Two', 
  'clearance' : {
    'level' : 9, 
    'modifylevel' : 9, 
    'admin' : true,
  } ,
  'profileimg' : '42.jpg'
};