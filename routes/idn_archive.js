/*
 * Routers: Imaging Database Network >> archive
 *
 * Available Routes
 * ================
 *
 * GET /idn/archive
 * GET /idn/archive/new
 * GET /idn/archive/edit
 * POST /idn/archive/new
 * POST /idn/archive/edit
 * POST /idn/archive/gettags
 *
 */
 
module.exports = function(app, config) {
  
  var systemVersion = config.systemVersion;
  var renderer = config.renderer;
  var setLang = config.setLang;
  var db = config.db;
  var Log = config.Log;
  var Fortress = config.Fortress;
  
  app.get('/idn/archive',function(req, res){
    setLang(req, renderer);
  var filter;
  if (req.query.f){
    filter = {'tags': {$in : req.query.f.toString().split(',')} };
  } else {
    filter = {};
  }
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
    db.find_and_render('article_entry', 'archive', {$and: [ { 'accesslevel' : {$lte : req.session.access.clearance.level.toString()} }, filter] }, {'_id': -1}, 0, function(contents){
      res.render(renderer.getView() + 'idn_archive', { 
                    title: 'archive',
                    layout: renderer.getView() +'idnlayout',
                    version: 'NTWRK>>IDN>' + systemVersion,
                    content: contents,
                    access: access_li,
                    nav_archive: renderer.nav_extend({'render_archive': true, 'render_manage': req.session.access.clearance.admin})
        });
    }, renderer, req.session.access.clearance.admin);
    }
  });
  
  app.get('/idn/archive/new',function(req, res){
    setLang(req, renderer);
  var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
    if (req.session.access != null) {
      if (req.session.access.clearance.modifylevel >= 1)
        res.render(renderer.getView() + 'archive_new', {
          title: 'archive',
          layout: renderer.getView() +'idnlayout',
          version: 'NTWRK>>IDN>' + systemVersion,
          access: access_li,
          nav_archive: renderer.nav_extend({'render_archive': true, 'render_manage': req.session.access.clearance.admin})
        });
      else
        res.render(renderer.getView() + '403', {
          title: 'archive',
          layout: renderer.getView() +'idnlayout',
          version: 'NTWRK>>IDN>' + systemVersion,
          access: access_li,
          nav_archive: renderer.nav_extend({'render_archive': true})
       });
    }  else
      res.render(renderer.getView() + '401', {
        title: 'archive',
        layout: renderer.getView() +'idnlayout',
        version: 'NTWRK>>IDN>' + systemVersion,
        access: access_li,
        nav_archive: renderer.nav_extend({})
       });
  });
  
  app.post('/idn/archive/new',function(req, res) {
  if (! Fortress({'req': req, 'res': res, 'protocols':['mlevel'], 'requirements': [1]}) ){
    res.send({err: 'Error: Insufficient modify level'});
    return;
  }
  var entry = req.body;
    entry.author = req.session.access.id;
    entry.authorid = req.session.access.accessObjID;
    for (var prop in entry){
      if (typeof (entry[prop]) === 'string')
        entry[prop] = entry[prop].replace(/\<script.*src\=.*http\<\/script\>/, ' ').replace(/\<script.{200,}\<\/script\>/, ' ');
    }
  db.insert('archive', entry, function(err){
    if (err)
      res.send({'ok': false, 'err': err});
    else {
    db.update('archive', {'entrytitle' : 'tags_container'}, { $addToSet: { 'tagname': { $each : entry.tags } } }, true, function(err){
    });
    new Log({
        'type': 'Archive',
        'tag': 'New entry',
        'user': req.session.access.id,
        'desc': 'New Entry posted: <a href="/archive/' + entry.entrytitle + '">' + entry.entrytitle + '</a>.',
        'req': req
      }).store();
      res.send({'ok': true, 'title': entry.entrytitle});
    }
  });
  });
  
  app.get('/idn/archive/edit',function(req, res){
    setLang(req, renderer);
  var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
    if (!req.query.t)  {
      res.render(renderer.getView() + '404', {
        title: 'archive',
        layout: renderer.getView() +'idnlayout',
        version: 'NTWRK>>IDN>' + systemVersion,
        access: access_li,
        nav_archive: renderer.nav_extend({})
      });
      return;
    }
  db.findOne('archive', { 'entrytitle' : req.query.t }, function(err, doc){
        if (doc) {
        if (doc.tags)
          var input_tags = doc.tags.toString();
        else
          var input_tags = '';
              if (req.session.access.clearance.modifylevel >= doc.accesslevel)
                res.render(renderer.getView() + 'archive_edit', {
                  title: 'archive',
                  layout: renderer.getView() +'idnlayout',
                  entrytitle : doc.entrytitle,
                  abstract : doc.abstract,
                  content : doc.content,
                  accesslevel : doc.accesslevel,
                  exceptions : '',
          tags : input_tags,
                  version: 'NTWRK>>IDN>' + systemVersion,
                  access: access_li,
                  nav_archive: renderer.nav_extend({'render_archive': true, 'render_manage': req.session.access.clearance.admin})
                });
              else
                res.render(renderer.getView() + '403', { 
                  title: 'archive',
                  layout: renderer.getView() +'idnlayout',
                  version: 'NTWRK>>IDN>' + systemVersion,
                  access: access_li,
                  nav_archive: renderer.extend(true, req.session.access.clearance.admin)
                });
            } 
            else {
              res.render(renderer.getView() + '404', {
                title: 'archive',
                layout: renderer.getView() +'idnlayout',
                version: 'NTWRK>>IDN>' + systemVersion,
                access: access_li,
                nav_archive: renderer.extend(false, false)
              });
            }
  });
  });
  
  app.post('/idn/archive/edit',function(req, res) {
  db.findOne('archive', {'entrytitle' : req.body.entrytitle}, function(err, doc){
    if (err)
      return res.send(err);
    if (doc){
      if (! Fortress({'req': req, 'res': res, 'protocols':['idmatch','admin'], 'operator': 'OR', 'params': [doc.authorid]}) ){
        return res.send({err: 'Error: You do not have the clearance required to edit this article.'});
      }
      for (var prop in req.body){
        if (typeof (req.body[prop]) === 'string')
          req.body[prop] = req.body[prop].replace(/\<script.*src\=.*http\<\/script\>/, ' ').replace(/\<script.{200,}\<\/script\>/, ' ');
      }
      db.update('archive', {'entrytitle' : req.body.entrytitle}, req.body, false, function(err){
        if (err)
        return res.send(err);
        else {
        db.update('archive', {'entrytitle' : 'tags_container'}, { $addToSet: { 'tagname': { $each : req.body.tags } } }, true, function(err){
        });
        new Log({
          'type': 'Archive',
          'tag': 'Entry edited',
          'user': req.session.access.id,
          'desc': 'Entry edited: <a href="/archive/' + req.body.entrytitle + '">' + req.body.entrytitle + '</a>.',
          'req': req
        }).store(); 
        res.send({'ok': true, 'title': req.body.entrytitle});
        }
      });
      } else
        res.send({err: 'Could not find specific entry.'});
    });
  });
  
  app.post('/idn/archive/gettags', function(req, res){
  db.findOne('archive', {'entrytitle' : 'tags_container'}, function(err, doc){
    if (doc && doc.tagname) {
    var contents = [];
    for (var i=0; i<doc.tagname.length; i++){
      contents.push(doc.tagname[i]);
    }
    res.send({content : contents});
    } else
      res.send({content : null})
  });
  });
  
  app.post('/idn/archive/remove', function(req, res){
  db.findOne('archive', {'_id' : new db.ObjectID(req.body.objid)}, function(err, doc){
    if (err)
      return res.send(err);
    if (doc){
      if (! Fortress({'req': req, 'res': res, 'protocols':['idmatch','admin'], 'operator': 'OR', 'params': [doc.authorid]}) ){
        return res.send({err: 'Error: You do not have the clearance required to edit this article.'});
      }
    db.remove('archive', {'_id' : new db.ObjectID(req.body.objid)},function(err){
      if (err)
      return res.send(err);
      else {
      new Log({
        'type': 'Archive',
        'tag': 'Entry removed',
        'user': req.session.access.id,
        'desc': 'Entry Removed: ' + req.body.title,
        'req': req
      }).store();
      res.send({'ok':true});
      }
    });
    } else
      res.send({err: 'Could not find specific entry.'});
  });
  });
  app.post('/idn/archive/rmtags', function(req,res){
        if (! Fortress({'req': req, 'res': res, 'protocols':['admin']}) )
    {
    res.send({err: 'Error: Administrator priviledges required.'});
    return;
    }
  db.update('archive',{'entrytitle' : 'tags_container'},{$pull : {'tagname' : req.body.tagname}},true,function(err){
    if (err)
        return res.send(err);


  });
  })
}