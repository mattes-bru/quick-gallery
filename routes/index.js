
/*
 * GET home page.
 */
 
var fs = require('fs');
var path = require('path');
var ex = require('exiv2');
var images = []; 
var galleryName = "";
var galleryPath = "";
 
exports.index = function(req, res){
  res.render('index', { title: galleryName , data: images });
};


exports.setGallery = function(dir) {
	galleryPath = dir;
	galleryName =  path.basename(dir);
}


 exports.updateGallery = function(req, res){
 	console.log("Scanning gallery in " + galleryPath);
 	
    fs.readdir(galleryPath, function(err, files){
        if(err){
            console.log("Can not read " + galleryPath + "\t" + err);
        }
        files.forEach(function(image){
           ex.getImageTags(path.join(galleryPath ,image) , function(err, tags) {
           	if(err){
           		console.log(err);
           	}
           	else {
           		var or = 0;
           		console.log("Exif Orientation: " + tags['Exif.Image.Orientation']);
           		switch(tags['Exif.Image.Orientation']) {
      
           		case "6":
           			or = 90;
           			break;
       			case "3":
       				or = 180;
       				break;
   				case "8":
   					or = 270;
   					break;
   				default:
   					break;
   				}
   					 
           		console.log("HTML Orientation: " + or);
               	images.push({name: image , timestamp: tags["Exif.Photo.DateTimeOriginal"] , camera: tags['Exif.Image.Model'] ,  orientation: or});
               }
           });
        });
    });
    
    res.send(200 , "Scanning gallery in " + galleryPath);
}

