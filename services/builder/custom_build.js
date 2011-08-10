/**
 *  Custom Builder
 *  Proccess the source files and returns packed versions of Chico-UI
 * 
 *  Output:
 *  tempxxxxx/name-x.x.x-x.zip
 *
 * */

var sys = require("sys"),
    fs = require("fs"),
    events = require('events'),
    Packer = require("./packer").Packer,
    packages = { size: 0, map: [] },
    exec  = require("child_process").exec;


var CustomBuild = function(_packages, flavor, avoid) {
	
	var self = this;
    
    self.folder = "./public/downloads/temp" + ~~(Math.random() * 99999) + "/";

    self._packages = _packages;
    
    self.flavor = flavor;
    
    self.avoid = avoid || false; // key to avoid create the zip file
    
    self.run();
    
};

// Inherit from EventEmitter
CustomBuild.prototype = new events.EventEmitter();


CustomBuild.prototype.run = function() {
	
	var self = this;
	
	fs.readFile( __dirname + "/builder.conf", function(err, data) {

	    if (err) {
	        sys.puts(err);
	        return;
	    }
	    
	    // Parse JSON data
	    self.build = JSON.parse(data);
	    self.build.output.uri = self.folder;
		
		// Save the amount of packages configured
		packages.size = self._packages.length;
	        
	    // Create temporary folder
		exec("mkdir " + self.folder, function(err) {
		
			if ( err ) {
				sys.puts( "Error: <Creating folder> " + err );
				return;
			}
		
		});
	        
	    sys.puts( "Building version " + self.build.version + " build nº " + self.build.build );
	    sys.puts( "Preparing " + packages.size + " packages." );
	    
		for (var i in self._packages) {
			self.pack( self._packages[i] );
			
		};
	});
}


CustomBuild.prototype.pack = function( package ) {
	
	var self = this;
	
	var _package = Object.create(package);
		_package.version = self.build.version;
		_package.output = self.build.output;
		_package.build = self.build.build;
		//_package.upload = build.locations[_package.upload];
		_package.template = self.build.templates[_package.type];

        var packer = new Packer( _package );        

            packer.on( "processed" , function( out ) {
                
                self.emit( "processed" , out );
                
            });

            packer.on( "done" , function( package ) {
               
               self.compress( package );

            });
	
}

CustomBuild.prototype.avoidCompress = function( bool ) {

    var self = this;
    
    self.avoid = bool || true;   

}

CustomBuild.prototype.compress = function( package ) {
	
	var self = this;
	
	if (self.avoid) {
	   return;   
    }
	
	if ( !package.upload ) {
        packages.size -= 1;    
    } else {
        packages.map.push( package );
    }
    
    if ( packages.map.length !== packages.size ) {
    	return;
    };

	// fix index routes    
    var filename = "chico"+package.filename.split("chico")[1];
    var indexFile = fs.readFileSync((package.input.split("/src")[0]) + "/index.html");
		indexFile = indexFile.toString().replace("php/packer.php?type=css", "src/" + self.flavor + "/css/"+ filename);
		indexFile = indexFile.toString().replace("php/packer.php?debug=true", "src/js/" + filename.replace(".css",".js"));
		fs.writeFileSync(self.folder + "index.html", indexFile);

	// fix the background routes	
	if (package.type === "css" ){
    var cssFile = fs.readFileSync(package.filename);
		cssFile = cssFile.toString().replace("../src/ml/assets/", "../assets/");
		fs.writeFileSync(package.filename, cssFile);
	}
	
        // routes
    var path = package.input.replace( "css/" , "assets/" ); //"../chico/src/assets/",
        zipName = self.build.name + "-" + package.fullversion + ".zip",

        // commands
        createFolders = "mkdir " + self.folder + "src && "
					  + "mkdir " + self.folder + "src/js && "
					  + "mkdir " + self.folder + "src/" + self.flavor + " && "
					  + "mkdir " + self.folder + "src/" + self.flavor + "/assets && "
					  + "mkdir " + self.folder + "src/" + self.flavor + "/css",
		movingJS = "mv " + self.folder + "*.js " + self.folder + "/src/js/",
		movingCSS = "mv " + self.folder + "*.css " + self.folder + "/src/" + self.flavor + "/css/",
        copyImages = (package.type === "css") ? "cp " + path + "* " + self.folder + "src/" + self.flavor + "/assets" : "ls",
        copyLicense = "cp " + (package.input.split("src/")[0]) + "LICENSE.txt " + self.folder,
        copyReadme = "cp " + (package.input.split("src/")[0]) + "README.md " + self.folder + "README.txt",
        createZip = "cd " + self.folder + " && tar -cvf " + zipName + " * && rm -rf *.js *.css *.html src",

        // package url
        url = self.folder.split("./public").join("") + zipName;

	sys.puts("Building package…");

    // Exec commands ;)
	exec(createFolders + " && " + 
		 copyLicense + " && " + 
		 copyReadme + " && " + 
		 copyImages + " && " +
		 movingJS + " && " +
		 movingCSS + " && " +
		 createZip , function(err) {
	   
        if ( err ) {
            sys.puts( "Error: <Creating Package> " + err );
            return;
        }
		
		sys.puts("Package builded at " + self.folder + zipName );
		
		self.emit( "done" , url );
		
    });
}

// --------------------------------------------------

exports.CustomBuild = CustomBuild;
