
/**
 * Module dependencies.
 */
 
var Db = require('./models/db');
var mongodb = new Db();
var express = require('express');
var MongoStore = require('connect-mongo')(express);
var filesystem = require('fs');
var app = module.exports = express.createServer();
app.db = mongodb;

// Configuration
var parseHtml = function(htmlName) { // seting up html layout models
  var fs = require('fs');
  var fs_ejs = require('fs');
  fs.readFile('./views/'+ htmlName + '.html', 'utf-8', function(err, data){
    if (err) {
      console.error(err);
    } else {
      //console.log(data);
      var indexHtml = data.toString();
      var patt = /..\/public\//g;
      while (patt.test(indexHtml))
        indexHtml = indexHtml.replace(patt,"/");
      fs_ejs.writeFile('./views/' + htmlName + '.ejs', indexHtml, 'utf-8', function(err){
      if (err)
        console.error(err);
      });
    }
  });
}

//parseHtml('layout');
//parseHtml('idnlayout');


require('./models/init')(app, function (err){
  app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    if (err)
      app.use(express.session({secret: 'sfeisysCS'}));
    else {
      setInterval(function() {
        app.db.updateParam();
        app.use(express.session({
          store: new MongoStore({
            db: app.db.db
          }),
          secret: 'sfeisysCS'
        }));
      }, 300000);
      app.use(express.session({
        store: new MongoStore({
          db: mongodb.db
        }),
        secret: 'sfeisysCS'
      }));
    }
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    });
    
    app.configure('development', function(){
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });
    
    app.configure('production', function(){
    app.use(express.errorHandler());
  });
  
  // Routes
  require('./routes')(app);
  
  app.listen(80, function(){
  console.log("Express server listening on port 8080 in %s mode", app.settings.env);
  });
});
