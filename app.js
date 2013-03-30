
/**
 * Module dependencies.
 */
 
var argv = require('optimist').string("gallery").argv;

var express = require('express')
  , routes = require('./routes')
  , image = require('./routes/image')
  , http = require('http')
  , path = require('path');



//var pictureDir = "/home/kll/Bilder/Weil_am_Rhein/Flug1/";
var pictureDir = argv.gallery;


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.normalize( pictureDir)));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


image.setDir(path.normalize( pictureDir));
routes.setGallery(path.normalize( pictureDir));

app.get('/', routes.index);
app.get('/preview', image.preview);
app.get('/image', image.image);
app.get("/updateGallery" , routes.updateGallery);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});



