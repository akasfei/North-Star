/*
 * Routers: Imaging Database Network >> Contacts
 *
 * Available Routes
 * ================
 *
 * GET /idn/contacts
 *
 */
module.exports = function (app, config){
  
  var systemVersion = config.systemVersion;
  var renderer = config.renderer;
  var setLang = config.setLang;
  var db = config.db;
  var Log = config.Log;
  var Fortress = config.Fortress;
  
  app.get('/idn/profile', function (req, res){
    setLang(req, renderer);
  var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
    if (req.session.access){
    db.find_and_render('article_entry', 'archive', { 'authorid' : req.session.access.accessObjID }, {'_id': -1}, 0, function(contents){
    res.render(renderer.getView() + 'idn_profile', {
      title: 'profile',
      layout: renderer.getView() +'idnlayout',
      version: 'NTWRK>>IDN>' + systemVersion,
      profileId: req.session.access.id,
      profile_extend: renderer.profile_extend(true),
      profileImgSrc: req.session.access.profileimg ? req.session.access.profileimg: 'Monochrome.jpg',
      articles: contents,
      profile: renderer.profile_desc(req.session.access),
      access: access_li,
      nav_archive: renderer.nav_extend({'render_archive': true, 'render_manage': req.session.access.clearance.admin})
    });
    }, renderer, true);
    } else {
    res.render(renderer.getView() + '401', {
        title: '',
        layout: renderer.getView() +'idnlayout',
        version: 'NTWRK>>IDN>' + systemVersion,
        access: access_li,
        nav_archive: renderer.nav_extend({})
      });
  }
  });
  
  app.get('/idn/profile/edit', function (req, res){
    setLang(req, renderer);
  var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
    if (req.session.access){
    res.render(renderer.getView() + 'idn_profile_edit', {
    title: 'profile',
    layout: renderer.getView() +'idnlayout',
    version: 'NTWRK>>IDN>' + systemVersion,
    profileId: req.session.access.id,
    profile_extend: renderer.profile_extend(true),
    profileImgSrc: req.session.access.profileimg ? req.session.access.profileimg: 'Monochrome.jpg',
        p_m_checked: req.session.access.desc ? (req.session.access.desc.gender == 'm' ? 'checked="checked"' : '') : '',
    p_f_checked: req.session.access.desc ? (req.session.access.desc.gender == 'f' ? 'checked="checked"' : '') : '',
    p_dob: req.session.access.desc ? (req.session.access.desc.dob ? req.session.access.desc.dob : '') : '',
    p_location: req.session.access.desc ? (req.session.access.desc.location ? req.session.access.desc.location : '') : '',
    p_blog_addr: req.session.access.desc ? (req.session.access.desc.blog ? req.session.access.desc.blog : '') : '',
    p_email: req.session.access.desc ? (req.session.access.desc.email ? req.session.access.desc.email : '') : '',
    p_intro: req.session.access.desc ? (req.session.access.desc.intro ? req.session.access.desc.intro : '') : '',
    access: access_li,
    nav_archive: renderer.nav_extend({'render_manage': req.session.access.clearance.admin})
    });
    } else {
    res.render(renderer.getView() + '401', {
        title: '',
        layout: renderer.getView() +'idnlayout',
        version: 'NTWRK>>IDN>' + systemVersion,
        access: access_li,
        nav_archive: renderer.nav_extend({})
      });
  }
  });
  
  app.get('/idn/profile/edit/imgselect', function (req, res){
  setLang(req, renderer);
  var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
  if (req.session.access)
    return res.render(renderer.getView() + 'idn_profile_imgselect', {
        title: 'profile',
        layout: renderer.getView() +'idnlayout',
        version: 'NTWRK>>IDN>' + systemVersion,
        access: access_li,
        nav_archive: renderer.nav_extend({})
      });
  else
    res.render(renderer.getView() + '401', {
        title: '',
        layout: renderer.getView() +'idnlayout',
        version: 'NTWRK>>IDN>' + systemVersion,
        access: access_li,
        nav_archive: renderer.nav_extend({})
      });
  });
  
  app.get('/idn/profile/:profileid', function (req, res){
    setLang(req, renderer);
  var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
  var myself = req.session.access ? (req.params.profileid == req.session.access.id) : false;
  var following = req.session.access ? (req.session.access.follows ? req.session.access.follows.toString().indexOf(req.params.profileid) > -1 : false) : false;
    db.findOne('access', {id: req.params.profileid}, function(err, profile){
    if (err)
      return res.send(err);
    if (profile)
    db.find_and_render('article_entry', 'archive', { 'author' : profile.id, 'accesslevel': {$lte: (req.session.access ? req.session.access.clearance.level : '1')} }, {'_id': -1}, 0, function(contents){
      res.render(renderer.getView() + 'idn_profile', {
      title: 'profile',
      layout: renderer.getView() +'idnlayout',
      version: 'NTWRK>>IDN>' + systemVersion,
      profileId: profile.id,
      profile_extend: renderer.profile_extend(myself, following, !req.session.access),
      profileImgSrc: profile.profileimg ? profile.profileimg: 'Monochrome.jpg',
      articles: contents,
      profile: renderer.profile_desc(profile),
      access: access_li,
      nav_archive: renderer.nav_extend({'render_archive': req.session.access, 'render_manage': req.session.access ? req.session.access.clearance.admin : false})
      });
    }, renderer, false);
    else
      return res.render(renderer.getView() + '404', {
      title: '',
      layout: renderer.getView() +'idnlayout',
      version: 'NTWRK>>IDN>' + systemVersion,
      access: access_li,
      nav_archive: renderer.nav_extend({})
    });
    });
  });
  
  app.post('/idn/profile/edit', function (req, res){
    if (! Fortress({'req': req, 'res': res, 'protocols':['authenticated']}) ){
      res.send({err: renderer.locale.Not_Authenticated});
      return;
    }
    req.session.access.desc = req.body;
    db.update('access', {id: req.session.access.id}, {desc: req.body}, false, function(err){
      if (err)
        res.send(err);
      else
        res.send({ok: true});
    });
  });

  app.post('/idn/profile/edit/passwd', function (req, res){
    if (! Fortress({'req': req, 'res': res, 'protocols':['authenticated']}) ){
      res.send({err: renderer.locale.Not_Authenticated});
      return;
    }
    var hash1 = require('crypto').createHash('sha1');
    var hash2 = require('crypto').createHash('sha1');
    var old_codehash = hash.update(req.body.oldcode, 'utf8').digest('base64');
    var new_codehash = hash.update(req.body.newcode, 'utf8').digest('base64');
    db.findOne('access', {id: req.session.access.id}, function (err, doc){
      if (doc){
        if (doc.codehash != old_codehash)
          return res.send({'err': renderer.invalid_code()});
        db.update('access', {id: req.session.access.id}, {codehash: new_codehash}, false, function(err){
          if (err)
            return res.send(err);
          return res.send({ok: true});
        });
      }
    })
  });
  
  app.post('/idn/profile/edit/imgselect', function (req, res){
    if (! Fortress({'req': req, 'res': res, 'protocols':['authenticated']}) ){
    res.send({err: renderer.locale.Not_Authenticated});
    return;
  }
  req.session.access.profileimg = req.body.src;
  db.update('access', {id: req.session.access.id}, {profileimg: req.body.src}, false, function(err){
    if (err)
      res.send(err);
    else
      res.send({ok: true});
  });
  });
  
  app.post('/idn/profile', function (req, res){
  if (req.session.access && req.session.access.id == req.body.id)
    return res.send({'profile': renderer.profile_thumbnail(req.session.access, req)});
    db.findOne('access', {id: req.body.id}, function(err, access){
    if (err)
      return res.send(err);
    if (access)
    return res.send({'profile': renderer.profile_thumbnail(access, req)});
    else
        return res.send({'profile': renderer.profile_not_found()});
    });
  });
  
  app.post('/idn/contact/follow', function(req, res){
    if (! Fortress({'req': req, 'res': res, 'protocols':['authenticated']}) ){
    return res.send({err: renderer.locale.Not_Authenticated});
  }
  db.update('access', {'id': req.session.access.id}, { $addToSet: { 'follows': req.body.followID } }, true, function(err){
    if (err)
      return res.send(err);
    else {
    if (req.session.access.follows)
      req.session.access.follows.push(req.body.followID);
    else
      req.session.access.follows = [req.body.followID];
    return res.send({'ok': true});
    }
  });
  });
  
  app.post('/idn/contact/unfollow', function(req, res){
    if (! Fortress({'req': req, 'res': res, 'protocols':['authenticated']}) ){
    return res.send({err: renderer.locale.Not_Authenticated});
  }
  var notfound = true;
  if (req.session.access.follows && req.session.access.follows.length > 0){
    for (var i=0; i< req.session.access.follows.length; i++){
    if (req.session.access.follows[i] == req.body.followID){
      notfound = false;
      var index = i;
      db.update('access', {'id': req.session.access.id}, { $pull: { 'follows': req.body.followID } }, true, function(err){
      if (err)
        return res.send(err);
      else {
        res.req.session.access.follows.splice(index, 1);
        return res.send({'ok': true});
      }
      });
    }
    }
  }
  if (notfound)
    return res.send({err: renderer.locale.Not_following});
  });
}