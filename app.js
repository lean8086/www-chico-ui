	
/**
 * module dependencies.
 */

var express = require('express'),
		events = require('events'),
		sys = require('sys'),
		fs = require('fs'),
		meta = require('./models/meta').meta,
		country = require('./models/country').country;
		CustomBuild = require('./services/builder/custom_build').CustomBuild,
		undefined,
		port = process.argv[2] || 8080;

var app = module.exports = express.createServer();

/**
* app constructor. 
*/


var title = function(title){
	var _meta = Object.create(meta);
	 _meta.title = title || "Chico UI, MercadoLibre's Open Source Web Tools.";
	return _meta;
}

var labelit = function(label){
	var label = label.split("-").join(" ");
	return (label + '').charAt(0).toUpperCase() + label.substr(1)
}
var createNavigationMapFrom = function(folder){
	var temp =[],
        folders = fs.readdirSync( __dirname + "/views/docs/" + folder),
	filename;
        folders.forEach(function(file){
                filename = file.split(".jade").join("");
		temp.push({
                        label: labelit(filename),
                        href: "/docs/" + folder + "/" + filename
                });
        });
        return temp;
}

meta.howtos = createNavigationMapFrom("how-to");

meta.demos = createNavigationMapFrom("demos");


// get 'builder.conf' and parse JSON data
meta.conf = JSON.parse(fs.readFileSync(__dirname + "/services/builder/builder.conf"));

// creates a collection of all versions inside /public/versions
meta.versions = (function(){
	var versions = [],
		temp = [],
		// read versions folder
		folders = fs.readdirSync( __dirname + "/public/versions/");
	if (folders) {
		// Ignore some specific folders
		folders.forEach(function(folder) {
			// Like the assets and latest folder
			if (folder !== "assets" && folder !== "latest") {
				versions.push(folder);
			}
		});
		// reorder versions
		versions.sort();
		versions.reverse();
		// get files from each version
		versions.forEach(function(folder) {
				subFolder = fs.readdirSync( __dirname + "/public/versions/" + folder),
				version = {version:folder, files:[]};
				// read the subfolder to map all files
			if (subFolder) {
				subFolder.forEach(function(file){
					// create a object for each file
					version.files.push({label: file, href: "/versions/"+folder+"/"+file});
				});
			}
			temp.push(version);
		});
	}
	return temp;
})();

meta.latest = (function(){
	var current = meta.versions[0],
		file, css, js;
	// find the .tar file from the latest version
	current.files.forEach(function(i){
		if (/^.+(\.(tar|zip))$/.test(i.label)) { file = i; }
		if (/^.+-min-.+(\.css)$/.test(i.label)) { css = i; }
		if (/^.+-min-.+(\.js)$/.test(i.label)) { js = i; }
	});
	return {
		version: current.version,
		download: file,
		javascript: js,
		stylesheet: css
	}
})();

/**
* app dynamicHelpers
*/
// dynamic helpers are simply functions that are invoked
// per request (once), passed both the request and response
// objects. These can be used for request-specific
// details within a view, such telling the layout which
// scripts to include.
app.dynamicHelpers({
	script: function (req, type, source) {
		req._files = [];
		req._code = [];
		
		var script = function (type, source) {
			if (typeof type  === "undefined") { return; }

			switch (type) {
				case "get":
					if (typeof source === "undefined") {
						return req._files;
					}
					req._files.push(source);
				break;

				case "code":
					if (typeof source === "undefined") {
						return req._code;
					}
					req._code.push(source);
				break;
			}
		};

		script(type, source);

		return script;
	}
});

/**
* app configuration.
*/
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('production', function(){
	app.use(express.errorHandler()); 
});

app.configure('development', function(){

	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 

    /**
     * Only for DEV environments
     * Latest JS and CSS
     * /latest/js 
     * /latest/css
     */
	app.get( '/latest/:type', function( req, res ) {

	var type = req.params.type,
		debug = req.query.debug,
		packages = [{
			"name": "chico",
			"type": type,
			"min": (debug) ? false : true,
			"embed": false,
			"avoid": true // Don't write the files
		}],
		custom = new CustomBuild({
			packages: packages, 
			flavor: "ml",
			avoid: true
		}); // to avoid create the zip file send last argument true

		custom.on("processed", function(data) {
			res.header('Content-Type', (type==="js") ? "text/javascript" : "text/css" );
			res.send(data);
		});
		
		custom.process();
	});

    /**
     * Latest Sprite images
     */
    app.get("/assets/:img", function(req, res, next){
    	var img = req.params.img,
            data = fs.readFileSync(meta.conf.input + 'ml/assets/'+img);

    	if (img&&data) { 
    	   	res.header('Content-Type', "image/png");
            res.send(data);
        }
    });

});


/**
* rutes
*/

app.get('/api', function(req, res, next){
	res.redirect("/api/"+meta.latest.version+"/index.html");
//	next();
});

/**
 * Download
 */

// get 
app.get('/download', function(req, res) {
	res.render( 'download', title("Download Chico UI") );
});
// post

app.post('/download', function( req, res ){

		var components = ( typeof req.body.class === "object" ) ? // If collection 
								  req.body.class.join(",") : 
								  req.body.class,
				abstracts = ( typeof req.body.abstract === "object" ) ? // If collection 
									 req.body.abstract.join(",") : 
									 req.body.abstract,
				utils = ( typeof req.body.util === "object" ) ? // If collection 
								 req.body.util.join(",") : 
								 req.body.util,
				flavor = req.body.flavor,
				add_mesh = req.body.mesh,
				add_jquery = req.body.jquery,
				add_belated = req.body.belated,
				embed = req.body.embed;
				env = req.body.env;

		if ( !abstracts || !utils || !components ) {
				res.send(); // Avoid process without components
				return;
		}

		// JavaScripts Pack
		var js = function() {
				return {
						"name": "chico",
						"components": abstracts + "," + utils + "," + components,
						"type": "js"
				}
		};

		// Stylesheets Pack
		var css = function() {
				return {
						"name": "chico",
						"components": components,
						"embed": ( embed ) ? true : false,
						"type": "css",
						"flavor": flavor
				}
		};
		
		// Mesh Pack
		var mesh = function() {
				return {
						"name": "mesh",
						"components": "mesh",
						"embed": ( embed ) ? true : false,
						"type": "css",
						"flavor": flavor
				}
		};

		// Pack the thing
		var packages = [];
		// for Production
		if ( env.toString().indexOf("p") > -1 ) {
			// Mesh
			if (add_mesh) {
				var p_mesh = mesh();
					p_mesh.min = true;
				packages.push(p_mesh);
			}
			// JS
			var p_js = js();
				p_js.min = true;
			packages.push(p_js);
			// CSS
			var p_css = css();
				p_css.min = true;
			packages.push(p_css);
		}
		
		// for Dev
		if ( env.toString().indexOf("d") > -1 ) {
			// Mesh	
			if (add_mesh) {
				var d_mesh = mesh();
				packages.push(d_mesh);
			}
			// JS
			var d_js = js();
			packages.push( d_js );
			// CSS
			var d_css = css();
			packages.push( d_css );
		}

/*		console.log({
			packages: packages, 
			flavor: flavor,
			depends: {
				jquery: add_jquery,
				belated: add_belated
			}
		});*/
		
		var custom = new CustomBuild({
			packages: packages, 
			flavor: flavor,
			depends: {
				jquery: add_jquery,
				belated: add_belated
			}
		});

		custom.on("done", function(url) {
			res.redirect(url);
		});
		
		custom.process();

});

/**
 * Discussion.
 */
// get
app.get('/discussion', function(req, res){
	res.render('discussion', title("Dicussion on Chico UI") );
});

/**
 * Docs.
 */

app.get('/docs', function(req, res){
	res.render('docs', title("Getting started with Chico UI"));
});

app.get('/docs/:branch/:label?', function(req, res){
	var branch = req.params.branch,
		label = req.params.label;
			
	if(branch!=undefined && label!=undefined){
		var redefBranch = (branch=='how-to')?'howtos':branch;
		url = '/docs/'+branch+'/'+label;
		items = meta[redefBranch];
		for(var i in items){
			if(items[i].href == url){
				res.render('docs/'+branch+'/'+label, title(branch + " " + labelit(label)) );
				return;
			}
		}
		res.render('404', meta );
		return;
		
	} else if(label==undefined){
		var url = '/docs/'+branch;
		items = meta.docs;
		for(var i in items){
			if(items[i].href == url){
				res.render('docs/', title("Getting started with Chico UI") );
				return;
			}
		}
		//res.send("Error 404 | Branch: "+branch+", Label: "+label);
		res.render('404', meta );
		return;
	}
	//res.send("Error 404 | Branch: "+branch+", Label: "+label);
	res.render('404', meta );
	return;
});

app.get('/suggest/:q', function(req, res){
	var q = req.params.q;
	var result = [];
		for(var a=(country.length-1);a;a--){
			var exist = country[a].search(q);
			if(!exist){
				result.push("\""+country[a]+"\"");
			}
		}
		var r = "autoComplete(["+result+"])";
		res.header('Content-Type', "text/javascript");
		res.send(r);
});

/**
 * Error pages
 */
app.get('/404', function(req, res){
	res.render('404', meta );
});

app.get('/500', function(req, res){
	res.render('404', meta );
});

/**
 * Index.
 */
app.get('/', function(req, res, next){
	res.render('index', title() );
});

/**
 * About.
 */
app.get('/about', function(req, res, next){
	res.render('about', title("About Chico UI") );
});

/**
 * Mesh.
 */
app.get('/mesh', function(req, res, next){
	res.render('mesh', title("Chico Mesh") );
});

/**
 * Blog.
 */
app.get('/blog', function(req, res, next){
	res.redirect("http://blog.chico-ui.com.ar");
});

app.get('/blog/:source/:file', function(req, res, next){
	var contentType = {
		"assets": "image/png",
		"css": "text/css",
		"js": "text/javascript",
	}
	var file = req.params.file,
		source = req.params.source,
        data = fs.readFileSync(__dirname + "/public/blog/"+source+"/"+file);

	if (file && data) { 
	   	res.header('Content-Type', contentType[source]);
        res.send(data);
    }
});

/**
 * app start
 */
app.listen(port);

/**
 * log
 */
console.log("Express server listening on port %d", app.address().port);
