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
    packages = { size: 0, map: [] },
    Packer = require("./packer").Packer,
    exec  = require("child_process").exec;


var CustomBuild = function(conf) {
	
	var self = this;

	// super constructor
	events.EventEmitter.call(self);
	
    self.packages = conf.packages;
    self.flavor = conf.flavor;
    self.avoid = conf.avoid || false; // key to avoid create the zip file
    self.input = conf.input;
    self.packed = 0;
    
};

// inheritance from EventEmmiter
sys.inherits(CustomBuild, events.EventEmitter);

CustomBuild.prototype.process = function() {

	sys.puts("> Reading 'builder.conf'.");
	
	var self = this,
		package;
	    // Get 'builder.conf' and parse JSON data
	    self.conf = JSON.parse(fs.readFileSync( __dirname + "/builder.conf"));
	    // Define output folder
        self.folder = self.conf.output + "temp" + ~~(Math.random() * 99999) + "/";
		// Echo message 
	    sys.puts( "Building version " + self.conf.version + " build nº " + self.conf.build + " - "
	    		+ "Preparing " + self.packages.length + " packages to save in " + self.folder );

	    // Create temporary folder
		if (!self.avoid) {
			sys.puts("CustomBuild > Creating folder " + self.folder);
			exec("mkdir " + self.folder, function(err) {
				if (err) {
					sys.puts( "Error - Custom Builder: <Creating temporary folder> " + err );
					return;
				}
			});
		}

		// Pack packages
		for (var i in self.packages) {
			package = self.packages[i];
			package.flavor = self.flavor;
			package.output = self.folder;
			package.input = self.input || self.conf.input; // if not self.input use the default
			package.version = self.conf.version;
			package.build = self.conf.build;
			package.avoid = self.avoid;
			package.template = self.conf.templates[package.type];			
			// pack it
			self.pack(package);
		};
}


CustomBuild.prototype.pack = function(package) {

	sys.puts("> Packing files.");

	var self = this;
	
	self.emit("packing");

	var pack = new Packer(package);
	
		pack.on("begin", function() {
			console.log(" > Begin packing file.")
		});

		pack.on("processed", function(out) {
			console.log("Custom build processed");
			self.emit("processed", out);
		});

		pack.on("done", function(packaged) {
			// increment packed packages
			self.packed++;
			// if the ammount of packed packages is equal 
			// to the ammount of packages to pack,
			// we are done packing, compress all packages.
			if (self.packed == self.packages.length) {
				// Aovid packing into zip file 
				if (!self.avoid) {
					self.compress(packaged);
				}
			}
		});

		pack.process();
}

CustomBuild.prototype.compress = function(package) {
	
	var self = this;
	
	// fix index routes    
    var filename = "chico"+package.filename.split("chico")[1];
    var indexFile = fs.readFileSync((package.input.split("/src")[0]) + "/index.html");
		indexFile = indexFile.toString().replace("http://chico.com:8080/latest/css", "src/" + self.flavor + "/css/"+ filename);
		indexFile = indexFile.toString().replace("http://chico.com:8080/latest/js", "src/js/" + filename.replace(".css",".js"));
		fs.writeFileSync(self.folder + "index.html", indexFile);
	
        // routes
    var path = package.input.replace( "css/" , "assets/" ); //"../chico/src/assets/",
        zipName = package.name + "-" + package.fullversion + ".zip",

        // commands
        createFolders = "mkdir " + self.folder + "src && "
					  + "mkdir " + self.folder + "src/js && "
					  + "mkdir " + self.folder + "src/" + self.flavor + " && "
					  + "mkdir " + self.folder + "src/" + self.flavor + "/assets && "
					  + "mkdir " + self.folder + "src/" + self.flavor + "/css",
        copyLicense = "cp " + (package.input.split("src/")[0]) + "LICENSE.txt " + self.folder,
        copyReadme = "cp " + (package.input.split("src/")[0]) + "README.md " + self.folder + "README.txt",
        copyImages = (package.type === "css") ? "cp " + path + self.flavor + "/assets/* " + self.folder + "src/" + self.flavor + "/assets/" : "ls",
		movingJS = "mv " + self.folder + "*.js " + self.folder + "src/js/",
		movingCSS = "mv " + self.folder + "*.css " + self.folder + "src/" + self.flavor + "/css/",
        createZip = "cd " + self.folder + " && tar -cvf " + zipName + " * && rm -rf *.js *.css *.html *.txt src",

        // package url
        url = self.folder.split("./public").join("") + zipName;

	sys.puts("Compressing packages.");

    // Exec commands ;)
	exec(createFolders + " && " + 
		 copyLicense + " && " + 
		 copyReadme + " && " + 
		 copyImages + " && " +
		 movingJS + " && " +
		 movingCSS + " && " +
		 createZip , function(err) {
	   
        if ( err ) {
            sys.puts( "Error - Custom Builder: <Creating Package> " + err );
            return;
        }
		
		sys.puts("Package builded at " + self.folder + zipName );
		
		self.emit( "done" , url );
		
    });
}

// --------------------------------------------------

exports.CustomBuild = CustomBuild;
