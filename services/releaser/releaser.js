//TODO: crear releaser.conf

// -	 Lee la configuracion
// - Recibe una version (tag de github);
// - Checkea si los issues de esa version estan cerrados (release notes + obtner ultima version)
// - Pull del repo + checkout del tag
// - Crear paquetes (2)
// 		- Code (chico.js y chico.css)
//		- Download (Zip con todo)
// - Subir cambios al repository
// - Taguear el repo si es neceasrio a la siguiente version


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

	var self = this;

	self.version = process.argv[2];
	
	sys.puts("Starting configure release...");

	fs.readFile( __dirname + "/releaser.conf", function( err , data ) {

		if (err) {
		    sys.puts(err);
		    return;
		};

		var release = JSON.parse(data);

		if (self.version == undefined) { self.version = release.version; };

		self.repository = release.repository;
		self.build = release.build;
		self.name = release.name;

		sys.puts("Release configurated: DONE!");
		sys.puts("Releasing Chico " + self.version + ". Please wait...");

		//self.checkIssues();
		/*if ( self.version != release.version ) {
			
			var new_version
			release.version = new_version;

			// write conf file
			fs.writeFile( __dirname + '/releaser.conf' , release , encoding='utf8' , function( err ) {
				if(err) {
				    sys.puts(err);
				}		    
			});

		};*/
		
		//sys.puts(self.version);
		
		self.updateLocalRepo();

	});
};

// Upadte repo from github
Releaser.prototype.updateLocalRepo = function(){

	var self = this;

	sys.puts("Pulling changes in " + self.repository);

	exec("cd chico/ && git checkout master && git pull origin master", function(err, data) {

		if ( err ) {
			sys.puts( "Error: <Pulling changes from github repository> " + err );
			return;
		};
		
		sys.puts(data);

		

		exec("cd chico/ && git checkout " + self.version, function(err, data) {

			var reg = new RegExp(self.version);

			// If not error, switch to tag fine
			if ( !err ) {
				sys.puts("Switching to " + self.version + "...");
				sys.puts("Switched to "+ self.version +": DONE!");
				
			// If have error and err contains self.version, the tag not exist in github
			} else if (err && err.toString().match(reg)){
				sys.puts("Make new relase: " + self.version);

			// Any error
			} else {
				sys.puts("Error: " + err);
			};

			
			self.configureBuild();
			
		});

	});

};

// Update builder.conf
Releaser.prototype.configureBuild = function(){

	var self = this

	// Read build.conf and update version number and reset build number
	sys.puts("Configuring builder...");
	fs.readFile( __dirname + '/../builder/builder.conf', function(err , data) {

		if (err) {
			sys.puts( "Error: Configuring builder..." + err );
			return;
		};

		// Parse JSON data
		var conf = JSON.parse(data);

		// increment version number
		// and reset build number
		if (conf.version != self.version) {
			conf.version = self.version;
			conf.build = 0;
		};

		conf.packages = self.build;

		// save build.conf file with incremented build number
		var new_conf = JSON.stringify(conf);

		sys.puts( "Saving configure builder...");

		// create and wirte build.conf file
		fs.writeFile( __dirname + '/../builder/builder.conf' , new_conf , encoding='utf8' , function( err ) {

			if(err) {
				sys.puts( "Error: Saving configure builder..." + err );
			};
			
			sys.puts("Builder configurated!");

			self.newBuild();

		});

	});

};

Releaser.prototype.newBuild = function(){

	var self = this;

	self.builder = new Builder();

	self.builder.on("done", function(out){

		exec("cd "+ __dirname + "/code/ && rm " + self.name + ".* && mv " + self.name + "*.js " + self.name + ".js && mv " + self.name + "*.css " + self.name + ".css", function(err, data){

			if(err) {
				sys.puts(err);
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
					sys.puts("Release: " + self.version + " complete!");
					return;
				};

			});

			if (!exists) { 	self.tagVersion(); };

		});

	});

};

Releaser.prototype.tagVersion = function(){

	var self = this;
	sys.puts("Creating tag " + self.version);
	// Create tag and push it to github
	exec("cd " + __dirname + self.repository + " && git tag \"" + self.version + "\" && git push --tag", function(err, data) {

		if (err) {
			sys.puts("Creating tag..." + err);
			return;
		};

		sys.puts("Created tag " + self.version + " DONE.");
		self.updateVersion();

	});

};

Releaser.prototype.updateVersion = function(){

	var self = this;

	// Update core.js and releaser.conf
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

		// write conf file
		fs.writeFile( __dirname + self.repository + "src/js/core.js", corejs, encoding='utf8', function( err ) {

			if(err) {
				sys.puts(err);
			};

			sys.puts("Updated version in core.js DONE!");

			self.updateRemoteRepo();

		});

	});

};

// push to github
Releaser.prototype.updateRemoteRepo = function(){
	var self = this;
	
	// Push changes
	sys.puts("Updating remote repository...");

	exec('cd ' + __dirname + self.repository + ' && git checkout master && git add . && git commit -m "' + self.version + '" && git push origin master', function(err, data) {

		if (err) {
			sys.puts("Updating remote failed." + err);
			return;
		};

		sys.puts("Release: " + self.version + " complete!. New version: " + self.newVersion + "created!");

	});

};

/*Releaser.prototype.checkIssues = function(){
	
	var self = this;
	
	exec("curl https://api.github.com/repos/mercadolibre/chico/issues?state=open", function(err, data){
		if (err) {
			sys.puts(err);
			return;
		};

		var issues = JSON.parse(data);

		//sys.puts(data);

	});

};*/

var release = new Releaser();
