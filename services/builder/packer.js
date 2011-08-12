/**
 * Chico-UI Packer Class.
 * @class Packer
 * @autor Natan Santolo <natan.santolo@mercadolibre.com>
 */
 
var sys = require("sys"),
    fs = require("fs"),
    events = require('events'),
    uglify = require("uglify-js"),
    cssmin = require('cssmin').cssmin,
    version = "2.0";
    
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
    self.embed = o.embed;
    self.avoid = o.avoid;
    self.template = o.template;
	// Compose data
    self.fullversion = o.version + "-" + o.build;
    self.filename = o.output + o.name + ( ( self.min ) ? "-min-" : "-" ) + self.fullversion + "." + self.type ;
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
    	core = "core." + self.type,
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
		// file name
		file = files[t];
		try {
			// try to get the data
			data = fs.readFileSync( uri + "/" + file, encoding="utf8");
		} catch(e) {
			// catch error… avoid stack
			sys.puts("Error - Packer: <File " + uri + "/" + file + " dosen't exists> " + e);
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
    	// (DEPRECATED) Data URI isn't working
    };
    
    // Minification process
	output = self.optimize(self.data);
    
    // Templating
    out = self.template.replace("<version>", self.fullversion);
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
        var encoded = new Encode64( __dirname + "/../../../" + repo + "/src/" + $2).encoded_data;
		return "url(\'" + encoded + "\');*background-image:url(\'" + $2 + "\');";

	});

};


Packer.prototype.write = function(file, data) {
    
    var self = this;

    if (!self.avoid) {
		fs.writeFileSync(file, data, encoding="utf8");
		sys.puts(" > Writting " + self.filename + "...");
		sys.puts("   Done!");
	}
	
    self.emit("done", self);
};

/* -----[ Exports ]----- */
exports.version = version;
exports.Packer = Packer;
