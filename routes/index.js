/*
 * Routers!
 *
 * Available Routes
 * ================
 *
 * GET /
 * GET /index
 * GET /about
 *
 */

module.exports = function (app){
  
  var systemVersion = require('../package').version;
  var Renderer = require('../models/render');
  var renderer = new Renderer('');
  var setLang = require('../models/localization').setLang;
  var db = app.db;
  var Log = require('../models/log');
  var Fortress = require('../models/security');
  
  var config = {
  'systemVersion': systemVersion,
  'renderer': renderer,
  'setLang': setLang,
  'db': db,
  'Log': Log,
  'Fortress': Fortress
  };
  
  var index = function(req, res){
  setLang(req, renderer);
    var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
    db.find_and_render('article_entry_thumbnail', 'archive', { 'accesslevel' : {$lte : '1'} }, {'_id': -1}, 3, function(contents){
    res.render(renderer.getView() + 'index', { 
        layout: renderer.getView() + 'indexlayout',
        title: 'index',
        version: 'NTWRK>>SYS>' + systemVersion,
        archive_content: contents,
        access: access_li
      });
  }, renderer, false);
    /*var mongourl = db.generate_mongo_url();
    require('mongodb').connect(mongourl, function(err, conn){
      conn.collection('archive', function(err, coll){
        coll.find({ 'accesslevel' : {$lte : '1'} }, function(err, cursor){
          var contents = '';
          if (cursor) {
            cursor.sort({'time': 1});
      cursor.limit(3);
            cursor.each(function(err, entry) {
              if (err)
              {
                contents = '<p>' + err + '</p>';
                return;
              }
              if(entry == null) {
                conn.close();
                if (contents == '')
                  contents = renderer.no_entry_found();
                res.render(renderer.getView() + 'index', { 
                  layout: renderer.getView() + 'layout',
          title: 'index',
                  version: 'NTWRK>>SYS>' + systemVersion,
                  archive_content: contents,
                  access: access_li
                });
                return;
              }
              contents += renderer.article_entry_thumbnail(entry,
                                                           false,
                               4);
            });
          }
        });
      });
    });*/
  }
 
  app.get('/', index);
  
  app.get('/index', index);
  
  app.get('/about',function(req, res){
  setLang(req, renderer);
    var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
    res.render(renderer.getView() + 'about', { 
      title: 'about',
    layout: renderer.getView() + 'layout',
      version: 'NTWRK>>SYS>' + systemVersion,
      access: access_li
    });
  });
  
  app.get('/admin', function(req, res){
  setLang(req, renderer);
    var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
  if (req.session.access && req.session.access.clearance.admin){
    res.render('admin', { 
        title: '',
    mongourl: db.generate_mongo_url(),
        layout: renderer.getView() +'layout',
        version: 'NTWRK>>IDN>' + systemVersion,
        access: access_li,
        nav_archive: renderer.nav_extend({})
      });
  } else {
    res.render(renderer.getView() + '401', { 
        title: '',
        layout: renderer.getView() +'layout',
        version: 'NTWRK>>IDN>' + systemVersion,
        access: access_li,
        nav_archive: renderer.nav_extend({})
      });
  }
  });
  
  require('./archive')(app, config);
  require('./idn')(app, config);
  require('./idn_archive')(app, config);
  require('./idn_access')(app, config);
  require('./idn_contact')(app, config);
  //app.get('/webapp',routes.webapp);
  //app.get('/webapp/:appname',routes.webapp_app);
}