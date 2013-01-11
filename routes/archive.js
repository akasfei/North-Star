/*
 * Routers: archive
 *
 * Available Routes
 * ================
 *
 * GET /archive
 * GET /archive/:entrytitle
 *
 */
 
module.exports = function(app, config) {
  
  var systemVersion = config.systemVersion;
  var renderer = config.renderer;
  var setLang = config.setLang;
  var db = config.db;
  var Log = config.Log;
  var Fortress = config.Fortress;
  
  app.get('/archive',function(req, res){
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
    db.find_and_render('article_entry', 'archive',{$and: [ { 'accesslevel' : {$lte : '1'} }, filter] }, {'_id': -1}, 0, function(contents){
	  res.render(renderer.getView() + 'archive', { 
        layout: renderer.getView() + 'layout',
        title: 'archive',
        version: 'NTWRK>>SYS>' + systemVersion,
        content: contents,
        access: access_li
      });
	}, renderer, req.session.access? req.session.access.clearance.admin:false);
  });
  
  app.get('/archive/:entrytitle',function(req, res){
    setLang(req, renderer);
	var mongourl = db.generate_mongo_url();
    var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
    db.findOne('archive', { 'entrytitle' : req.params.entrytitle }, function(err, doc){
	  if (err)
	    return res.render(renderer.getView() + 'archive_view', {
                title: 'archive',
				layout: renderer.getView() + 'layout',
                entrytitle : 'Error/',
                abstract : '',
                content : err,
				author : '',
				language : req.session.lang,
				tags : '',
                time : new Date().toString(),
				comments: '',
				objid: '',
                timestamp : '0x' + require('../models/misc').getTimeStamp(),
                version: 'NTWRK>>SYS>' + systemVersion,
                access: access_li
        });
	  if (doc) {
		  	var label_tags = '',
			    posted_comments = '';
			if (doc.tags){
			  for (var i = 0; i<doc.tags.length; i++)
			    label_tags = renderer.label(doc.tags[i]);
			}
			if (doc.comments){
			  for (var i = 0; i<doc.comments.length; i++){
				posted_comments += renderer.comment(doc.comments[i], req.session.access);
			  }
			}
			posted_comments += renderer.comment_new(req.session.access);
            if ((doc.accesslevel <= 1 || (req.session.access && req.session.access.clearance.level >= doc.accesslevel) ) && req.params.entrytitle != 'tags_container'){
			  var buttons = req.session.access ? (req.session.access.clearance.admin || req.session.access.id == doc.author ? renderer.buttons_edit(doc.entrytitle):''):'';
              res.render(renderer.getView() + 'archive_view', {
                title: 'archive',
				layout: renderer.getView() + 'layout',
                entrytitle : doc.entrytitle,
                abstract : doc.abstract,
                content : doc.content,
				author : doc.author,
				language : doc.language,
				tags: label_tags,
				buttons_edit: buttons,
                time : doc.time.toString(),
				comments: posted_comments,
				objid: doc._id,
                timestamp : '0x' + require('../models/misc').getTimeStamp(doc.time),
                version: 'NTWRK>>SYS>' + systemVersion,
                access: access_li
              });
			} else
              res.render(renderer.getView() + '403', { 
                title: 'archive',
				layout: renderer.getView() + 'layout',
                version: 'NTWRK>>SYS>' + systemVersion,
                access: access_li,
              });
          } else {
            res.render(renderer.getView() + '404', {
              title: 'archive',
			  layout: renderer.getView() + 'layout',
              version: 'NTWRK>>SYS>' + systemVersion,
              access: access_li
            });
      }
	});
  });
  
  app.post('/archive/get',function(req, res){
	setLang(req, renderer);
	var filter = req.body.filter.split(',');
    db.find_and_render('article_entry_thumbnail', 'archive',{ 'accesslevel' : {$lte : '1'}, 'tags': {$all : filter} }, {'_id': -1}, 3, function(contents){
	  res.send({content: contents});
	}, renderer, false);
  });
  
  app.post('/archive/comment', function(req, res){
	if (! Fortress({'req': req, 'res': res, 'protocols':['authenticated']}) ){
	  res.send({err: renderer.locale.Not_Authenticated});
	  return;
	}
	var comment = {
	  'accessid': req.session.access.id,
	  'body': req.body.comment,
	  'time': new Date(),
	  'id': require('../models/misc').getTimeStamp() + req.session.access.accessObjID
	};
	db.update('archive', {'_id': new db.ObjectID(req.body.entryid)}, {$push: {comments: comment} }, true, 
	function (err){
	  if (err)
	    res.send({'ok': false, 'err': err});
	  else
	    res.send({'ok': true, 'comment': renderer.comment(comment, req.session.access)});
	});
  });
  
  app.post('/archive/comment/remove', function(req, res){
	db.findOne('archive', {'_id': new db.ObjectID(req.body.entryid)}, function(err, doc){
	  if (err)
	    return res.send(err);
	  if (doc){
		var comment_author;
		if (doc.comments){
		  for (var i=0; i<doc.comments.length; i++){
			if (doc.comments[i].id == req.body.id){
			  comment_author = doc.comments[i].accessid;
			  break;
			}
		  }
		}
		if (! Fortress({'req': req, 'res': res, 'protocols': ['idmatch','admin'], 'params': [comment_author], 'operator': 'OR'}) ){
		  return res.send({err: 'Error: Access ID mismatch.'});
		}
		db.update('archive', {'_id': new db.ObjectID(req.body.entryid)}, {$pull: {comments: {'id': req.body.id}} }, true, 
		function (err){
		  if (err)
			res.send(err);
		  else
			res.send({'ok': true});
		});
	  } else
	    res.send({err: 'Could not find specified entry.'});
	});
  });
  
  app.post('/archive/comment/removeall', function(req, res){
	if (! Fortress({'req': req, 'res': res, 'protocols':['admin']}) ){
	  res.send({err: 'Error: Administrator priviledges required.'});
	  return;
	}
	db.update('archive', {'entrytitle': req.body.entrytitle}, {comments: []}, false, 
	function (err){
	  if (err)
	    res.send({'ok': false, 'err': err});
	  else
	    res.send({'ok': true});
	});
  });
}