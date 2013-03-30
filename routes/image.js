var ex = require('exiv2');
var path = require('path');
var fs = require('fs');
/*
 * GET users listing.res.write(
 */
 
// var dir = "/home/kll/Bilder/Weil_am_Rhein/Flug1/";
var dir = "";

exports.preview = function(req, res){
	if(req.query.image) {
  		ex.getImagePreviews(path.join(dir ,req.query.image), function(err, previews) {
		  	if(err) {
		  		console.log("Failed to read preview of "+ path.join(dir ,req.query.image) + "\t" + err);
		  		res.send(404, 'Error read preview');
		  	}
		  	else {
			      // Display information about the previews.
			     // console.log(previews);
			      //res.writeHead(200 , {"Content-Type": previews[0].mimeType}
			      res.write(previews[0].data , "binary");
			      res.end();
			  }
	      	
	      });
  }
  else {
  
    res.send(404, 'Sorry, we cannot find that!');
  }
      
};


exports.image = function(req, res){
    if(req.query.image) {
        var img = path.join(dir ,req.query.image);
        if(path.extname(img) === ".CR2"){
        
	        ex.getImagePreviews(path.join(dir ,req.query.image), function(err, previews) {
	            if(err) {
	                console.log("Failed to read preview of "+ path.join(dir ,req.query.image) + "\t" + err);
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
          else if(path.extname(img) === ".jpg") {
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




exports.setDir = function(newPath){
	dir = newPath;
}


