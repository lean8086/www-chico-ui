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


var CustomBuild = function(_packages) {
	
	var self = this;
    
    self.folder = "./public/downloads/temp" + ~~(Math.random() * 99999) + "/";
    
    self._packages = _packages;
    
    self.avoid = false; // key to avoid create the zip file
    
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
		
	sys.puts( "Compressing files..." );
	
	var zipName = self.build.name + "-" + package.fullversion + ".zip" ;

	exec("cd ./" + self.folder + " && tar -cvf " + zipName + " * && rm *.js *.css", function(err) {
	   
        if ( err ) {
            sys.puts( "Error: <Creating folder> " + err );
            return;
        }
		
		sys.puts("Package builded at " + self.folder + zipName );
		
		self.emit( "done" , self.folder.split("/public").join("") + zipName );
    });	
}

// --------------------------------------------------

exports.CustomBuild = CustomBuild;