/*
 * Class Access
 *
 * Constructor function Access(access)
 *
 * Properties
 * ==========
 *
 * id        - the id of this access
 * codehash  - SHA1 hash value of this access code
 * clearance - the access's security clearance
 *
 * No methods available.
 */

function Access(access) {
  this.id = access.id;
  this.codehash = access.codehash;
  this.clearance = access.clearance;
  this.accessObjID = access._id ? access._id.toString(): null;
  this.desc = access.desc;
  this.follows = access.follows;
  this.followers = access.followers;
  this.profileimg = access.profileimg;
  return this;
};
module.exports = Access;