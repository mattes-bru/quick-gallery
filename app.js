
/**
 * Module dependencies.
 */
 
var argv = require('optimist').string("gallery").argv;

var express = require('express')
  , http = require('http')
  , path = require('path');

var gallery = require('./gallery');

//var pictureDir = "/home/kll/Bilder/Weil_am_Rhein/Flug1/";
var pictureDir = path.normalize( argv.gallery);

gallery.update(pictureDir);

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



app.get('/', function(req, res){
    res.render('index', { title: "Test" , data: gallery.getImages() });
});
app.get('/preview', gallery.preview);
app.get('/image', gallery.image);
app.get("/updateGallery" , function(req ,res){
    gallery.update(pictureDir);
    res.send(200 , "Scanning gallery in " + pictureDir);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});



