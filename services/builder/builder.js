/**
 *  Builder, run.js
 *  Proccess the source files and returns packed versions of Chico-UI
 * 
 *  Output:
 *  chico-x.x.x.js
 *  chico-min.x.x.x.js
 *
 * */

var sys = require("sys"),
    fs = require("fs"),
    events = require('events'),
	Packer = require("./packer").Packer;    

var Builder = function(){
	var self = this;

    self.packages = { size: 0, map: [] };
	self.donePackages = 0;

    self.run();

    return self;

};

// Inherit from EventEmitter
Builder.prototype = new events.EventEmitter();

Builder.prototype.run = function() {
	var self = this;

    fs.readFile( __dirname + '/builder.conf', function( err , data ) { 

		if (err) {
		    sys.puts(err); 
		    return;
		}
		
		// Parse JSON data
		var build = JSON.parse(data);
		    // increment build number
		    build.build++;
		    // save the amount of packages configured
		    self.packages.size = build.packages.length;
		    
		sys.puts( "Building version " + build.version + " build nº " + build.build );
		sys.puts( "Preparing " + self.packages.size + " packages." );
		
		// for each build.packages
		for (var i in build.packages) {
		    
		    var _package = Object.create(build.packages[i]);
		        _package.version = build.version;
		        _package.build = build.build;
		        _package.template = build.templates[_package.type];
    		        _package.output = (build.packages[i].hasOwnProperty("output")) ? build.packages[i].output : build.output;

		    var packer = new Packer( _package );

			packer.on( "done" , function( out ) {    

				self.donePackages += 1;

				if(self.donePackages == self.packages.size){
					self.emit("done");
				};

            });

		} // end for build.packages
			
		// save conf file  with incremented build number
		var new_build = JSON.stringify(build);
		
		// write conf file
		fs.writeFile( __dirname + '/builder.conf' , new_build , encoding='utf8' , function( err ) {
		    if(err) {
		        sys.puts(err);
		    }
		    
		});
		
	});
};

/* -----[ Exports ]----- */
exports.Builder = Builder;
