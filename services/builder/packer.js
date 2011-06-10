/**
 * Chico-UI Builder Class.
 * @class Builder
 * @autor Natan Santolo <natan.santolo@mercadolibre.com>
 */
 
var sys = require("sys"),
    fs = require("fs"),
    events = require('events'),
    child = require("child_process"),
    uglify = require("uglify-js"),
    cssmin = require('cssmin').cssmin,
    Encode64 = require('./encode64').Encode64,
    exec  = child.exec,
    spawn = child.spawn,
    version = "1.2";

var Packer = function(o) {

    sys.puts( "________       ___________________ " );           
    sys.puts( "___  __ )___  ____(_)__  /_____  /____________" );
    sys.puts( "__  __  |  / / /_  /__  /_  __  /_  _ \\_  ___/" );
    sys.puts( "_  /_/ // /_/ /_  / _  / / /_/ / /  __/  / "+version );
    sys.puts( "/_____/ \\__,_/ /_/  /_/  \\__,_/  \\___//_/   " );
    sys.puts( " " );

    var self = this;
    
    // Package data
    self.ui = [];
    self.name = o.name;
    self.version = o.version;
    self.fullversion = o.version + "-" + o.build;
    self.input = o.input;
    self.type = o.type;
    self.min = o.min;
    self.upload = o.upload;
    self.template = o.template;
    self.filename = o.output.uri + o.name + ( ( self.min ) ? "-min-" : "-" ) + self.fullversion + "." + self.type ;
    if (o.components) {
        self.components = (o.components.split(",").join("." + self.type + ",").split(",")) + "." + self.type;
    }


    self._files = {
        names: [], // name of the files
        data: [], // content of the files
        total: 0,
        loaded: 0,
        bytesLoaded: 0
    };

    self._files.ready = function() { return self._files.total === self._files.loaded; };

    // Begin ;)
    self.run();
            
};

// Inherit from EventEmitter
Packer.prototype = new events.EventEmitter();

Packer.prototype.run = function() {
    
    // private scope
    var self = this;
    var _files = self._files;
    var core = "core."+self.type;
    
    // TODO: refactor
    var testComp = function(files){
    	
    	// Iteration variables
        var t = _files.total = files.length, file = "", i = 0;

        // Iteration
        for ( i ; i < t ; i++ ) {
            // each file
            file = files[i];
            
            // ignore ".DS_Store"
            if ( file === ".DS_Store" ) {
                _files.total -= 1;
                continue;
            }

            // Save file name
            var savedIndex = _files.names.push( file );

            // Get data from file and process it.
            self.loadFile( file , savedIndex );

        } // end Iteration

        self.emit( "run-complete", files );
    };
    
    if ( self.components && self.components.length > 0 ){
    	
    	// Puts core always first.
		self.components = ( core + "," + self.components.split( core + "," ).join("") ).split(",");
    	
    	testComp(self.components);
    	
    } else {
        
	    // Get files for the defined package
	    fs.readdir( self.input , function( err, files ) {
	    
	        if ( err ) {
	            sys.puts("Error: <Reading files> "+err);
	            return;
	        }
	        
	        // Puts core always first.
	        files = ( core + "," + files.join(",").split( core + "," ).join("") ).split(",");
	
	        testComp(files);
	        
	    }); // end Get files
    };
};

Packer.prototype.loadFile = function( file, savedIndex ) {
    
    var self = this;
    var _files = self._files;
    
    // Read file
    fs.readFile( self.input + file , function( err , data ) { 
        
        if (err) {
            sys.puts("Error: <Reading file "+file+"> "+err);
            _files.loaded += 1;
            return;
        }
        
        if (self.type=="js") {
            // Get the first comment
            var raw = data.toString().split("/**").join("><><").split(" */").join("><><").split("><><")[1];
            // Seek for UI Components
            if ( !/@abstract/.test( raw ) && file !== "core.js") {
                self.ui.push( file );
            }
        }
        
        // Save file data
        _files.data[savedIndex] = data;
        
        // Save file size
        _files.bytesLoaded += data.length;
        
        // Increment loaded counter
        _files.loaded += 1;
        
        // Are we ready ?
        if ( _files.ready()  ) {
            
            self.emit( "loaded", file );
            
            // All files saved then process
            self.process();
        }
        
    });

};

Packer.prototype.process = function() {

    var self = this;
    var _files = self._files;

    sys.puts( " > Processing " + self.filename );

    self.ui = self.ui.join(",").split(".js").join("");
    
    // Code replacements
    var output = _files.data.join("");
        // Add UI Components
        output = output.replace( "components: \"\"," , "components: \"" + self.ui + "\"," );
        // Add version number
        output = output.replace( "version:\"\"" , "version:\"" + self.fullversion + "\"" );

    var output_min = false;
    
    sys.puts( "   original size " + output.length );            
    
    
    //if ( self.embed_images && self.type == "css" ) {
    	
    	output = self.embedImages(output.toString());
    		
    //};
    
    //console.log(">>>>>>>>>>>>>>>" + self.min);
    if ( self.min ) {
    
        switch( self.type ) {
        
            case "js":
                //output_min = uglify(output.toString()); // compressed code here
                var ast = uglify.parser.parse(output.toString());
					ast = uglify.uglify.ast_mangle(ast);
					ast = uglify.uglify.ast_squeeze(ast);
				output_min = uglify.uglify.gen_code(ast);
                break;
    
            case "css":
                output_min = cssmin(output);
                break;
        }

        sys.puts( "   optimized size " + output_min.length );

    };
    
    // Templating
    var out = self.template.replace( "<version>" , self.fullversion );
        out = out.replace( "<code>" , ( output_min || output ) );
        
    self.emit( "processed" , out );
    
    self.write( self.filename , out );    

};


Packer.prototype.embedImages = function( str ) {

	return str.replace(/(url\(\')(.*)(\'\);)/gi, function(str, $1, $2){
        
        // Generate dataURI
        var encoded = new Encode64("../chico/src/" + $2).encoded_data;

		return "url(\'data:image/png;base64," + encoded + "\');*background-image:url(\'" + $2 + "\');";
			
	});

};


Packer.prototype.write = function( file , data ) {
    
    var self = this;
    
    fs.writeFile( file , data , function( err ) {
        
        if ( err ) {
            sys.puts( err );
            return;
        }

        sys.puts( " > Writting " + self.filename + "..." );
        sys.puts( "   Done! " );

        self.emit( "writed", self.filename );
        self.emit( "done", self );
    });

};

/* -----[ Exports ]----- */
exports.version = version;
exports.Packer = Packer;
