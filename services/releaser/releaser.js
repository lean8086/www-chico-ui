/**
 * Chico-UI Releaser
 * @class Releaser
 */

var sys = require("sys"),
    fs = require("fs"),
    events = require('events'),
    child = require("child_process"),
    exec  = child.exec,
    	Builder = require("../builder/builder.js").Builder,
	CustomBuild = require('../builder/custom_build.js').CustomBuild,
    version = "0.1";

var Releaser = function(){

    sys.puts( " _____      _" );                   
    sys.puts( "|  __ \\    | |" + version);                         
    sys.puts( "| |__) |___| | ___  __ _ ___  ___ _ __" );
    sys.puts( "|  _  // _ \\ |/ _ \\/ _` / __|/ _ \\ '__|" );
    sys.puts( "| | \\ \\  __/ |  __/ (_| \\__ \\  __/ |" );
    sys.puts( "|_|  \\_\\___|_|\\___|\\__,_|___/\\___|_| " ) ;
    sys.puts( " " );

	var self = this;

    self.run();
};

// Inherit from EventEmitter
Releaser.prototype = new events.EventEmitter();

// Read releaser.conf
Releaser.prototype.run = function(){

	// process.argv[2] is the version to release
	if (process.argv[2] == undefined) { 
		sys.puts("Error: Please insert the version to release as argument.");

		return;
	};

	var self = this;

	sys.puts("Starting release configuration...");

	self.version = process.argv[2];
	
	fs.readFile( __dirname + "/releaser.conf", function( err , data ) {

		if (err) {
		    sys.puts("Error: <Starting release configuration...>" + err);
		    return;
		};

		var release = JSON.parse(data);

		self.name = release.name;
		self.repository = release.repository;
		self.build = release.build;
		self.fullPackage = release.fullPackage;

		sys.puts("Release " + self.version + " configurated!");

		self.updateLocalRepo();

	});
};

// Upadte local repository from github
Releaser.prototype.updateLocalRepo = function(){

	var self = this;

	sys.puts("Updating local repository: " + self.repository);

	exec("cd " + __dirname + self.repository + " && git checkout master && git pull origin master", function(err, data) {

		if ( err ) {
			sys.puts( "Error: <Updating the local repository...> " + err );
			return;
		};

		exec("cd " + __dirname + self.repository + " && git checkout " + self.version, function(err, data) {

			var reg = new RegExp(self.version);

			// If not error, switch to tag
			if ( !err ) {
				sys.puts("Switching to " + self.version + "...");
				sys.puts("Switched to "+ self.version +": DONE!");
				
			// If have error and err contains self.version, the tag not exist in github
			} else if (err && err.toString().match(reg)){
				sys.puts("Make new release: " + self.version);

			// Any error
			} else {
				sys.puts("Error: " + err);
			};

			self.configureBuild();
			
		});

	});

};

// Configure builder.conf
Releaser.prototype.configureBuild = function(){

	var self = this

	sys.puts("Configuring builder...");

	// Read build.conf, update the number of the version and reset number of build
	fs.readFile( __dirname + '/../builder/builder.conf', function(err , data) {

		if (err) {
			sys.puts( "Error: <Configuring builder...>" + err );
			return;
		};

		var conf = JSON.parse(data);

		if (conf.version != self.version) {
			conf.version = self.version;
			conf.build = 0;
		};

		conf.packages = self.build;

		var new_conf = JSON.stringify(conf);

		sys.puts( "Saving builder configuration...");

		// overwrite build.conf file
		fs.writeFile( __dirname + '/../builder/builder.conf' , new_conf , encoding='utf8' , function( err ) {

			if(err) {
				sys.puts( "Error: <Saving builder configuration...>" + err );
			};
			
			sys.puts("Builder configurated!");

			self.newBuild();

		});

	});

};

// Create build and custom build (full package)
Releaser.prototype.newBuild = function(){

	var self = this;

	self.builder = new Builder();

	self.builder.on("done", function(out){
		sys.puts("Moved JS files to site directory...");
		exec("cd " + __dirname + "/../../code/js/ && rm " + self.name + ".* && mv " + self.name + "*.js " + self.name + ".js", function(err, data){

			if(err) {
				sys.puts( "Error: <Moving JS files to site directory...> " + err );
			};

		});

		sys.puts("Moved CSS files to site directory...");
		exec("cd " + __dirname + "/../../code/css/ && rm " + self.name + ".* && mv " + self.name + "*.css " + self.name + ".css", function(err, data){

			if(err) {
				sys.puts( "Error: <Moving CSS files to site directory...> " + err );
			};

		});

		exec("cd "+ __dirname + self.repository + " && git tag", function(err, data){

			if(err) {
				sys.puts(err);
			};

			var _tags = data.toString().split("\n");
			var exists = false;

			_tags.forEach(function(tag){

				if (self.version == tag) {
					exists = true;
					sys.puts("Release " + self.version + " version complete!");
					return;
				};

			});

			if (!exists) { 	self.tagVersion(); };

		});

	});


	self.customBuilder = new CustomBuild( self.fullPackage );

	self.customBuilder.on("done", function(uri){
		sys.puts("Moved full package to download directory.");
		exec("cd " + __dirname + "/../../download/" + self.version + " || mkdir " + __dirname + "/../../download/" + self.version + " && mv "+ __dirname + "/public" + uri + " " + __dirname + "/../../download/" + self.version + "/", function(err, data){

			if (err) {
				sys.puts("Error <Moving full package to download directory...>" + self);
			};

		});
	});
};

// Create a new tag on github width the version
Releaser.prototype.tagVersion = function(){

	var self = this;
	sys.puts("Creating tag " + self.version);

	exec("cd " + __dirname + self.repository + " && git tag \"" + self.version + "\" && git push --tag", function(err, data) {

		if (err) {
			sys.puts("Error: <Creating tag...>" + err);
			return;
		};

		sys.puts("Created tag " + self.version + " DONE.");

		self.updateVersion();

	});

};

// Update version in core.js
Releaser.prototype.updateVersion = function(){

	var self = this;

	sys.puts("Updating version in core.js...");
	
	fs.readFile( __dirname + self.repository + "src/js/core.js", function( err , data ) {

		if (err) {
			sys.puts(err);
			return;
		};
		
		var version = self.version.split(".").join("");
		var newVersion = (parseInt(version, 10) + 1);

		if (newVersion < 100) { newVersion = "0" + newVersion; };

		self.newVersion = newVersion.toString().split("").join(".");

		var corejs = data.toString().replace(/version:.*?\"([0-9](.)?)*\"/,"version: \""+ self.newVersion + "\"");

		fs.writeFile( __dirname + self.repository + "src/js/core.js", corejs, encoding='utf8', function( err ) {

			if(err) {
				sys.puts(err);
			};

			sys.puts("Updated version in core.js DONE!");

			self.updateRemoteRepo();

		});

	});

};

// Push to github
Releaser.prototype.updateRemoteRepo = function(){
	var self = this;
	
	sys.puts("Updating remote repository...");

	exec('cd ' + __dirname + self.repository + ' && git checkout master && git add . && git commit -m "Update version to ' + self.newVersion + '" && git push origin master', function(err, data) {

		if (err) {
			sys.puts("Error: <Updating remote repository...>" + err);
			return;
		};

		sys.puts("Release: " + self.version + " complete!");

	});

};

var release = new Releaser();
