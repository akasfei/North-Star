/*
 * Routers: Imaging Database Network
 *
 * Available Routes
 * ================
 *
 * GET /idn
 * GET /idn/logout
 * GET /idn/log
 *
 */
 
module.exports = function(app, config) {
  
  var systemVersion = config.systemVersion;
  var renderer = config.renderer;
  var setLang = config.setLang;
  var db = config.db;
  var Log = config.Log;
  var Fortress = config.Fortress;
  
  app.get('/idn',function(req, res){
    setLang(req, renderer);
    var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
    if (req.session.access == null)
      res.render(renderer.getView() + 'idn_authenticate', { 
        title: '',
        layout: renderer.getView() +'idnlayout',
        version: 'NTWRK>>IDN>' + systemVersion,
        access: access_li,
        nav_archive: renderer.nav_extend({'no_profile': true})
      });
    else{
      var buttons_admin = ''
      if (req.session.access.clearance.admin)
        buttons_admin = renderer.buttons_admin();
      var mongourl = db.generate_mongo_url();
      var level = req.session.access.clearance.level.toString();
      db.findOne('access', {'id': req.session.access.id }, function (err, doc){
        if (err)
          return res.status(401).render(renderer.getView() + '401', {
          title: 'archive',
          layout: renderer.getView() +'idnlayout',
          version: 'NTWRK>>IDN>' + systemVersion,
          access: access_li,
          nav_archive: renderer.nav_extend({'no_profile': true})
          });
        if (doc){
          if (doc.follows && doc.follows.length > 0)
            db.find_and_render('article_entry', 'archive', {'author': {$in: doc.follows}, 'accesslevel': {$lte: (req.session.access ? req.session.access.clearance.level : '1')}}, {'_id': -1}, 0, function(contents){
              res.render(renderer.getView() + 'idn', { 
              title: '',
              layout: renderer.getView() +'idnlayout',
              version: 'NTWRK>>IDN>' + systemVersion,
              access: access_li,
              accessid: req.session.access.id,
              accesslevel: req.session.access.clearance.level,
              buttons_extend: buttons_admin, 
              profileImgSrc: req.session.access.profileimg ? req.session.access.profileimg: 'Monochrome.jpg',
              recent: contents,
              nav_archive: renderer.nav_extend({'render_archive': true, 'render_manage': req.session.access.clearance.admin})
              });
            }, renderer, req.session.access.clearance.admin);
          else
            res.render(renderer.getView() + 'idn', { 
              title: '',
              layout: renderer.getView() +'idnlayout',
              version: 'NTWRK>>IDN>' + systemVersion,
              access: access_li,
              accessid: req.session.access.id,
              accesslevel: req.session.access.clearance.level,
              buttons_extend: buttons_admin, 
              profileImgSrc: req.session.access.profileimg ? req.session.access.profileimg: 'Monochrome.jpg',
              recent: renderer.no_entry_found(),
              nav_archive: renderer.nav_extend({'render_archive': true, 'render_manage': req.session.access.clearance.admin})
            });
        } else
          return res.status(404).render(renderer.getView() + '404', {
            title: 'archive',
            layout: renderer.getView() +'idnlayout',
            version: 'NTWRK>>IDN>' + systemVersion,
            access: access_li,
            nav_archive: renderer.nav_extend({})
          });
      });
    }
  });
  
  app.get('/idn/logout', function(req, res){
    new Log({
      'type': 'Access',
      'tag': 'logout',
      'user': req.session.access.id,
      'desc': req.session.access.id + ' terminated connection',
      'req': req
    }).store();
    req.session.access = null;
    access_id = 'Not Authenticated';
    res.redirect('/idn');
  });
  
  app.get('/idn/log', function(req, res){
    setLang(req, renderer);
    if (req.query.f){
      filter = {'type': {$in : req.query.f.toString().split(',')} };
    } else {
      filter = {};
    }
    var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
    if (req.session.access && req.session.access.clearance.admin){
      db.find_and_render('log', 'log', filter, {'_id': -1}, 0, function(contents){
        res.render(renderer.getView() + 'archive', { 
            layout: renderer.getView() + 'idnlayout',
            title: '',
            version: 'NTWRK>>IDN>' + systemVersion,
            content: contents,
            access: access_li,
            nav_archive: renderer.nav_extend({'render_archive': true, 'render_manage': req.session.access.clearance.admin})
          });
        }, renderer);
    } else {
      res.status(401).render(renderer.getView() + '401', {
          title: 'archive',
          layout: renderer.getView() +'idnlayout',
          version: 'NTWRK>>IDN>' + systemVersion,
          access: access_li,
          nav_archive: renderer.nav_extend({})
      });
    }
  });
  
  app.post('/idn/getMyArticles', function(req, res){
    if (! Fortress({'req': req, 'res': res, 'protocols':['authenticated']}) ){
      res.send({err: renderer.locale.Not_Authenticated});
      return;
    }
    db.find_and_render('article_entry_thumbnail', 'archive', { 'authorid' : req.session.access.accessObjID }, {'_id': -1}, 3, function(contents){
      res.send({
        'ok': true, 
        'content': '<ul class="thumbnails">' + contents + '</ul></div>'
      });
    }, renderer, req.session.access.clearance.admin);
  });
  
  app.post('/idn/getFeeds', function(req, res){
    if (! Fortress({'req': req, 'res': res, 'protocols':['authenticated']}) ){
      res.send({err: renderer.locale.Not_Authenticated});
      return;
    }
    if (req.session.access.follows && req.session.access.follows.length > 0)
      db.find_and_render('article_entry', 'archive', {'author': {$in: req.session.access.follows}, 'accesslevel': {$lte: (req.session.access ? req.session.access.clearance.level : '1')} }, {'_id': -1}, 0, function(contents){
        res.send({
          'ok': true,
          'feeds': contents
        });
      }, renderer, req.session.access.clearance.admin);
    else
      res.send({'ok': true,'feeds': renderer.no_entry_found()});
  });
  
  app.post('/idn/getContacts', function(req, res){
    setLang(req, renderer);
    if (! Fortress({'req': req, 'res': res, 'protocols':['authenticated']}) ){
      res.send({err: renderer.locale.Not_Authenticated});
      return;
    }
    if (req.session.access.follows && req.session.access.follows.length > 0){
      db.find_and_render('article_profile', 'access', {'id': {$in: req.session.access.follows} }, {'id': 1}, 0, function(contents){
        res.send({'ok': true, 'contacts': contents});
      }, renderer, false);
    } else {
      res.send({'ok': true, 'contacts': renderer.no_entry_found()});
    }
  });
}