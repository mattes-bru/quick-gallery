/**
 * New node file
 */
 
var fs = require('fs');
var path = require('path');
var ex = require('exiv2');
 
 var galleryPath = "";
 var images = [];
 var noImages = 0;
 
 exports.getImages = function(){
    return images;
}

 exports.update = function(dir){
    if(dir){
        galleryPath = dir;
    }
    console.log("Scanning gallery in " + galleryPath);
    images = [];
    noImages = 0;
    
    processFolder(galleryPath);
    


}


function processFolder(folder) {
    fs.readdir(folder, function(err ,files){
        if(err) {
            console.log(err);
        }
        else {
            for(var i = 0; i < files.length; i++){
                var ext  = path.extname(files[i]).toLowerCase();
                if ((ext == ".jpg")||(ext == ".cr2"))  {
                    console.log(files[i] + " is an image");
                    noImages++;
                    processImage(path.join(folder , files[i]));
                }
                else if(ext == ""){
                    console.log(files[i] + " seems to be a folder");
                    processFolder(path.join(folder , files[i]));
                }
                
            }
        }
    
    });
    
}


function processImage(image){
   ex.getImageTags(image, function(err, tags) {
        if(err){
            console.log(err);
        }
        else {
            var or = 0;
            //console.log("Exif Orientation: " + tags['Exif.Image.Orientation']);
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
                 
            //console.log("HTML Orientation: " + or);
            images.push({name: path.basename(image) , path: path.relative(galleryPath , path.dirname(image)) , timestamp: tags["Exif.Photo.DateTimeOriginal"] , camera: tags['Exif.Image.Model'] ,  orientation: or});
      }
    });
}


exports.preview = function(req, res){
    if(req.query.image) {
        var img = path.join(galleryPath , images[req.query.image].path , images[req.query.image].name );
        ex.getImagePreviews(img, function(err, previews) {
            if(err) {
                console.log("Failed to read preview of "+ img + "\t" + err);
                res.send(404, 'Error read preview');
            }
            else {
                  if(previews.length > 0){
                    res.write(previews[0].data , "binary");
                    res.end();
                  }
                  else {
                    fs.readFile(img , "binary" , function(err , file) {
	                if(err) {
	                    console.log("Failed to read image of "+ img + "\t" + err);
	                    res.send(404, 'Error read image');
	                }
	                else {
	                      // Display information about the previews.
	                     // console.log(previews);
	                      //res.writeHead(200 , {"Content-Type": previews[0].mimeType}
	                      res.write(file , "binary");
	                      res.end();
	                  }
	
	               });
                  }

              }
            
          });
  }
  else {
  
    res.send(404, 'Sorry, we cannot find that!');
  }
      
};




exports.image = function(req, res){
    if(req.query.image) {
        var img = path.join(galleryPath , images[req.query.image].path , images[req.query.image].name );
         var ext  = path.extname(img).toLowerCase();
        if(ext === ".cr2"){
        
            ex.getImagePreviews(img, function(err, previews) {
                if(err) {
                    console.log("Failed to read preview of "+ img + "\t" + err);
                    res.send(404, 'Error read preview');
                }
                else {
                      // Display information about the previews.
                     // console.log(previews);
                      //res.writeHead(200 , {"Content-Type": previews[0].mimeType}
                      res.write(previews[previews.length-1 ].data , "binary");
                      res.end();
                  }
                
              });
          }
          else if(ext === ".jpg") {
            fs.readFile(img , "binary" , function(err , file) {
                if(err) {
                    console.log("Failed to read image of "+ img + "\t" + err);
                    res.send(404, 'Error read image');
                }
                else {
                      // Display information about the previews.
                     // console.log(previews);
                      //res.writeHead(200 , {"Content-Type": previews[0].mimeType}
                      res.write(file , "binary");
                      res.end();
                  }

            });
          }
        else {
  
        res.send(404, 'Sorry, we cannot find that!');
      }
          
  }
  else {
  
    res.send(404, 'Sorry, we cannot find that!');
  }
      
};