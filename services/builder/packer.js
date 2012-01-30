/**
 * Chico-UI Source Code Compiler.
 * @namespace Packer
 * @autor Natan Santolo <natan.santolo@mercadolibre.com>
 */
 
var sys = require("sys"),
    fs = require("fs"),
    child = require("child_process"),
    exec  = child.exec,
    events = require('events'),
    uglify = require("uglify-js"),
    cssmin = require('cssmin').cssmin,
    Encode64 = require('./encode64').Encode64,
    version = "2.1";
  
/*
* Normalize name function
* @function nn
* @param string
* @return string
*/ 
var nn = function(s) { 
	return (s + '').charAt(0).toLowerCase() + s.substr(1); 
};

/*
* Compiles al source files and generates a new file,
* Support minification for CSS and JS files.
* @class Packer
* @param {object} Object with configuration properties
*/ 
var Packer = function(o) {

    if(false === (this instanceof Packer)) {
        return new Packer();
    }

	// super constructor
	events.EventEmitter.call(this);

    var self = this;
    // Package data
    self.name = o.name;
    self.version = o.version;
    self.input = o.input;
    self.type = o.type;
    self.flavor = o.flavor;
    self.min = o.min;
    console.log("-----------------------------------------");
    self.embed = o.embed;
    self.avoid = o.avoid;
	self.data = "";
    self.template = o.template;
	// Compose data
    self.fullversion = o.version + "-" + o.build;
    self.filename = o.output + o.name + ( ( self.min ) ? "-min-" : "-" ) + self.version + "." + self.type ;
	// Files collection
    self.files = [];
    // Are components defined?
    if (o.components) {
        self.components = (o.components.split(",").join("." + self.type + ",").split(",")) + "." + self.type;
    }

    // Begin ;)
	self.emit("begin");
	
};

// inheritance from EventEmmiter
sys.inherits(Packer, events.EventEmitter);

Packer.prototype.process = function() {

    // private scope
    var self = this,
		core = (self.name != "mesh") ? "core." + self.type : "",
    	// file information
    	files = [], file,
    	// raw data
		data = "",
		output,
		out;

    // Get files for the defined package
	// Define the location
	var uri = self.input + (self.type === "css" ? self.flavor + "/" : "") + self.type;

	if (!self.components){
		// Save the files from the location
		files = fs.readdirSync(uri);
    } else {
    	files = self.components.split(",");
    }

	// Puts core always first.
	files = files.join(",");
	// filter ".DS_Store,"
	files = files.replace(".DS_Store,","");
	// and "core.js" should be the first thing...
	files = core + "," + files.replace(core + ",", "");
	// save the file collection
	files = files.split(",").reverse();
	var t = files.length;
	// iterate each file to get its raw data.
	while (t--) {
		// file name, parsed with nn() function
		// to make the first character lowerCase
		file = nn(files[t]);
		try {
			// try to get the data
			data = fs.readFileSync( uri + "/" + file, encoding="utf8");
		} catch(e) {
			// catch error… avoid stack
			// sys.puts("Error - Packer: <File " + uri + "/" + file + " dosen't exists> " + e);
			continue;
		}
		
		if (!data) {
			continue;
		}
				
		// sabe the file with is specific data
		self.files.push({
			name: file,
			data: data
		});
		// concatenate data in the global scope
		self.data += data.toString();
	}

	// Embed images on CSS sources
    if (self.embed && self.type == "css") {
    	// Data URI isn't working
    	//self.data = self.embedImages(self.data)
    };
    
    // Minification process
	output = self.optimize(self.data);
    
    // Templating
    out = self.template.replace("<version>", self.version);
    out = out.replace("<code>", output);
	
    self.emit("processed", out);

	self.write(self.filename, out);

	return out;

};

Packer.prototype.optimize = function(data) {

	var self = this,
		output;
		
    if (self.min) {
        switch(self.type) {
            case "js":
                var ast = uglify.parser.parse(data);
					ast = uglify.uglify.ast_mangle(ast);
					ast = uglify.uglify.ast_squeeze(ast);
				output = uglify.uglify.gen_code(ast);
			break;
            case "css":
                output = cssmin(data);
			break;
        }
        sys.puts(" > Optimized size " + output.length);
    };

	return output || data;

}

Packer.prototype.embedImages = function(str) {

	var self = this;

	return str.replace(/(url\(\')(.*)(\'\);)/gi, function(str, $1, $2){
        // Generate dataURI
        var repo = self.input.split("/")[1];
        var encoded = new Encode64( __dirname + "/../../../" + repo + "/src/" + self.flavor + "/assets/" + $2).encoded_data;
		return "url(\'" + encoded + "\');*background-image:url(\'" + $2 + "\');";

	});

};


Packer.prototype.write = function(file, data) {
    
    var self = this;

    if (!self.avoid) {

		exec("touch " + file, function(err){

			if (err) {
				sys.puts("Error - " + self.name + ": " + err);
			};

			fs.writeFile(file, data, encoding="utf8", function (err) {
				if (err) {
					console.log("Error - " + self.name + ": " + err);
				} else {
					sys.puts(" > Writting " + self.filename + "...");
					sys.puts("   Done!");
				}
			});

		});

		/*
		
		fs.writeFile(file, data, encoding="utf8", function (err) {
			if (err) {
				console.log("Error - " + self.name + ": " + err);
			} else {
				sys.puts(" > Writting " + self.filename + "...");
				sys.puts("   Done!");
			}
		});
		
		fs.writeFileSync(file, data, encoding="utf8");
		sys.puts(" > Writting " + self.filename + "...");
		sys.puts("   Done!");*/

	}
	
    self.emit("done", self);
};

/* -----[ Exports ]----- */
exports.version = version;
exports.Packer = Packer;
