/*
 * Routers: Imaging Database Network >> access
 *
 * Available Routes
 * ================
 *
 * GET /idn/access
 * GET /idn/access/request
 * GET /idn/access/request/success
 * GET /idn/access/manage
 * GET /idn/access/manage/request
 * POST /idn/access/request
 * POST /idn/access/manage/request
 * POST /idn/access/getlist
 * POST /idn/access/manage
 * POST /idn/access/manage/remove
 * POST /idn/access
 */
 
module.exports = function(app, config) {
  
  var systemVersion = config.systemVersion;
  var renderer = config.renderer;
  var setLang = config.setLang;
  var db = config.db;
  var Log = config.Log;
  var Fortress = config.Fortress;
  
  app.get('/idn/access', function(req, res){
    setLang(req, renderer);
	var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
    if (req.session.access == null)
      res.render(renderer.getView() + '401', { 
        title: '',
        layout: renderer.getView() +'idnlayout',
        version: 'NTWRK>>IDN>' + systemVersion,
        access: access_li,
        nav_archive: renderer.nav_extend({})
      });
    else
      res.render(renderer.getView() + 'access', {
        title: '',
        layout: renderer.getView() +'idnlayout',
        version: 'NTWRK>>IDN>' + systemVersion,
        access: access_li,
        accessid: req.session.access.id,
        nav_archive: renderer.nav_extend({'render_profile': true, 'render_archive': true, 'render_manage': req.session.access.clearance.admin})
      });
  });
  
  app.get('/idn/access/request', function(req, res){
    setLang(req, renderer);
	var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
    res.render(renderer.getView() + 'idn_request', {
      title: '',
      layout: renderer.getView() +'idnlayout',
      version: 'NTWRK>>IDN>' + systemVersion,
      access: access_li,
      nav_archive: renderer.nav_extend({})
    });
  });
  
  app.post('/idn/access/request', function(req, res){
    setLang(req, renderer);
	var entry = req.body;
	entry.time = new Date();
	db.insert('access_request', entry, function(err){
	  if (err)
	    res.send(err);
	  else {
		new Log({
	      'type': 'Access',
	      'tag': 'New request',
	      'user': req.body.id,
	      'desc': 'New access request:' + req.body.id + '. <a href="/idn/access/manage">Manage accesses</a>',
	      'req': req
	    }).store();
		res.send({'ok': true});
	  }
	});
  });
  
  app.get('/idn/access/request/success', function(req, res){
    setLang(req, renderer);
	var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
    res.render(renderer.getView() + 'idn_request_success', {
      title: '',
      layout: renderer.getView() +'idnlayout',
      version: 'NTWRK>>IDN>' + systemVersion,
      access: access_li,
      nav_archive: renderer.nav_extend({})
    });
  });
  
  app.get('/idn/access/register', function(req, res){
    setLang(req, renderer);
	var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
    res.render(renderer.getView() + 'idn_register', {
      title: '',
      layout: renderer.getView() +'idnlayout',
      version: 'NTWRK>>IDN>' + systemVersion,
      access: access_li,
      nav_archive: renderer.nav_extend({})
    });
  });
  
  app.post('/idn/access/register', function(req, res){
    setLang(req, renderer);
	var hash = require('crypto').createHash('sha1');
	var codehash = hash.update(req.body.code, 'utf8').digest('base64');
	var access = {
	  'id': req.body.id,
	  'codehash': codehash,
	  'clearance': {
		'level' : '2',
		'modifylevel' : '0',
		'admin' : false
	  }
	};
	db.findOne('access', {'id': access.id}, function(err, doc){
	  if (err)
	    return res.send(err);
	  if (doc)
	    return res.send({err: 'This access id already exists.'});
	  db.insert('access', access, function(err){
		if (err){
		  res.send(err);
		  return;
		} else {
		  new Log({
			'type': 'Access',
			'tag': 'New access',
			'user': req.body.id,
			'desc': 'Access granted.:' + req.body.id,
			'req': req
		  }).store();
		  res.send({'ok': true});
		}
	  });
	});
  });
  
  app.get('/idn/access/register/success', function(req, res){
    setLang(req, renderer);
	var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
    res.render(renderer.getView() + 'idn_register_success', {
      title: '',
      layout: renderer.getView() +'idnlayout',
      version: 'NTWRK>>IDN>' + systemVersion,
      access: access_li,
      nav_archive: renderer.nav_extend({})
    });
  });
  
  app.get('/idn/access/manage', function(req, res){
    setLang(req, renderer);
	var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
    if (req.session.access == null)
      res.render(renderer.getView() + '401', { 
        title: '',
        layout: renderer.getView() +'idnlayout',
        version: 'NTWRK>>IDN>' + systemVersion,
        access: access_li,
        nav_archive: renderer.nav_extend({})
      });
    else{
      if (!req.session.access.clearance.admin){
        res.render(renderer.getView() + '403', { 
          title: '',
          layout: renderer.getView() +'idnlayout',
          version: 'NTWRK>>IDN>' + systemVersion,
          access: access_li,
          nav_archive: renderer.nav_extend({'render_archive': true, 'render_manage': false})
        });
      } else {
		db.find_and_render('access_entry', 'access', {}, {}, 0, function(contents){
		  res.render(renderer.getView() + 'idn_access_manage', { 
                      title: 'access/manage',
                      layout: renderer.getView() +'idnlayout',
                      version: 'NTWRK>>IDN>' + systemVersion,
                      content: contents,
                      access: access_li,
                      nav_archive: renderer.nav_extend({'render_profile': true, 'render_archive': true, 'render_manage': true})
          });
		}, renderer, false);
      }
    }
  });
  
  app.post('/idn/access/manage/getexisting', function(req, res){
	if (! Fortress({'req': req, 'res': res, 'protocols':['admin']}) ){
	  res.send({err: 'Error: Administrator priviledges required.'});
	  return;
	}
    db.find_and_render('access_entry', 'access', {}, {}, 0, function(contents){
	  res.send({content : contents});
	}, renderer, false);
  });
  
  app.post('/idn/access/manage/getrequest', function(req, res){
	if (! Fortress({'req': req, 'res': res, 'protocols':'admin'}) ){
	  res.send({err: 'Error: Administrator priviledges required.'});
	  return;
	}
	    db.find_and_render('access_request_entry', 'access_request', {}, {'time': 1}, 0, function(contents){
		  res.send({content : contents});
		}, renderer, false);
  });
  
  app.post('/idn/access/manage/new', function(req, res){
	if (! Fortress({'req': req, 'res': res, 'protocols':'admin'}) ){
	  res.send({err: 'Error: Administrator priviledges required.'});
	  return;
	}
	var mongourl = db.generate_mongo_url();
	var Access = require('../models/access');
	var hash = require('crypto').createHash('sha1');
	var codehash = hash.update(req.body.code, 'utf8').digest('base64');
	var access = {
	  'id': req.body.id,
	  'codehash': codehash,
	  'clearance': {
		'level' : req.body.accesslevel,
		'modifylevel' : req.body.modifylevel,
		'admin' : false
	  }
	};
	db.insert('access', access, function(err){
	  if (err){
		res.send(err);
		return;
	  } else {
		new Log({
		  'type': 'Access',
		  'tag': 'New access',
		  'user': req.session.access.id,
		  'desc': 'Access granted.:' + req.body.id,
		  'req': req
		}).store();
		res.send({'ok': true});
	  }
	});
  });
  
  app.post('/idn/access/manage/request', function(req, res){
	if (! Fortress({'req': req, 'res': res, 'protocols':'admin'}) ){
	  res.send({err: 'Error: Administrator priviledges required.'});
	  return;
	}
    if (req.body.grant == 'true')  {
      var mongourl = db.generate_mongo_url();
      var Access = require('../models/access');
      var hash = require('crypto').createHash('sha1');
      var codehash = hash.update(req.body.code, 'utf8').digest('base64');
      var access = new Access(req.body.id, codehash, {
        'level' : req.body.accesslevel,
        'modifylevel' : req.body.modifylevel,
		'admin' : false
      }, null);
	  db.insert('access', access, function(err){
        if (err){
	      res.send(err);
		  return;
		} else {
		  db.findOne('access_request', {'_id' : new db.ObjectID(req.body.objid)}, function(err, doc){
			if (err){
			  res.send(err);
			  return;
			}
			new Log({
	          'type': 'Access',
	          'tag': 'New request',
	          'user': req.session.access.id,
	          'desc': 'Access granted.:' + req.body.id + '.<br><blockquote>Request note: '+ doc.note +'<br>Request email:'+ doc.email +'</blockquote>',
	          'req': req
	        }).store();
			db.remove('access_request', {'_id' : new db.ObjectID(req.body.objid)}, function(err){
	          if (err)
	            res.send(err);
	          else
			    res.send({'ok': true});
		    });
          });
		}
	  });
    } else {
	  db.remove('access_request', {'_id' : new db.ObjectID(req.body.objid)}, function(err){
		if (err)
		  res.send(err);
		else
		  res.send({'ok': true});
	  });
	}
  });
  
  app.post('/idn/access/getlist', function(req,res){
	db.find_and_render('dropdown_li', 'access', {}, {}, 0, function(contents){
      if (contents == renderer.no_entry_found()){
        res.send(null);
      } else
        res.send({content : contents});
	}, renderer, false);
  });
  
  app.post('/idn/access/manage',function(req, res) {
	if (! Fortress({'req': req, 'res': res, 'protocols':'admin'}) ){
	  res.send({err: 'Error: Administrator priviledges required.'});
	  return;
	}
    var access_clearance = {
      'level' : req.body.level,
      'modifylevel' : req.body.mlevel,
      'admin' : req.body.admin == "true"
    };
	db.update('access', {'_id' : new db.ObjectID(req.body._id)}, { clearance: access_clearance }, false, function(err){
	  if (err)
	    res.send(err);
	  else {
		new Log({
	      'type': 'Access',
	      'tag': 'Modification',
	      'user': req.session.access.id,
	      'desc': 'Access information modified: <a href="/idn/access/manage">' + req.body._id + '</a>.',
	      'req': req
	    }).store();
	    res.send({'ok': true});
	  }
	});
  });
  
  app.post('/idn/access/manage/remove', function(req, res){
	if (! Fortress({'req': req, 'res': res, 'protocols':'admin'}) ){
	  res.send({err: 'Error: Administrator priviledges required.'});
	  return;
	}
	db.remove('access', {'_id' : new db.ObjectID(req.body._id)}, function(err){
	  if (err)
	    res.send(err);
	  else {
		new Log({
	      'type': 'Access',
	      'tag': 'Removal',
	      'user': req.session.access.id,
	      'desc': 'Access removed: ' + req.body._id + '.',
	      'req': req
	    }).store();
	    res.send({'ok': true});
	  }
	});
  });
  
  app.post('/idn/access', function(req, res){
    req.session.access = null;
    var Access = require('../models/access');
    var hash = require('crypto').createHash('sha1');
    var codehash = hash.update(req.body.code, 'utf8').digest('base64');
	db.findOne('access', { 'id': req.body.id,'codehash' : codehash }, function(err, doc){
	  if (doc){
        var access = new Access(doc);
        req.session.access = access;
        access_id = access.id;
		new Log({
	      'type': 'Access',
	      'tag': 'Authentication',
	      'user': req.session.access.id,
	      'desc': 'Authenticated: ' + req.session.access.id + '.',
	      'req': req
	    }).store();
		db.find_and_render('article_entry_thumbnail', 'archive', { 'authorid' : req.session.access.accessObjID }, {'time': 1}, 0, function(contents){
		  var access_li = (req.session.access == null) ? 
              renderer.nav_dropdown_li('NA',-1) : 
              renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
		  res.send({
			'ok': true, 
			'recent': '<div class="row-fluid"><ul class="thumbnails">' + contents + '</ul></div>', 
			'userinfo': renderer.user_info(req.session.access), 
			'nav_extend': renderer.nav_extend({'render_archive': true, 'render_manage': req.session.access.clearance.admin}),
			'access_li': access_li
		  });
		}, renderer, req.session.access.clearance.admin);
        
      }
      else
		res.send({'ok': false, 'err': renderer.invalid_code()});
	});
  });
}