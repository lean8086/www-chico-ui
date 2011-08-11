
/**
 * module dependencies.
 */

var express = require('express'),
		events = require('events'),
		sys = require('sys'),
		fs = require('fs'),
		CustomBuild = require('./services/builder/custom_build').CustomBuild,
		meta = require('./models/meta').meta;
		undefined;


var app = module.exports = express.createServer();

/**
 * constants.
 */
 
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

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
	app.use(express.errorHandler()); 
});

/**
 * rutes
*/
// build lastest version
app.get( '/lastest/:type/:min?', function( req, res ) {
 			
		var type = req.params.type,
			min = req.params.min,
			packages = [{
				"name": "chico",
				"input": (type==="js")?"../chico/src/"+type+"/":"../chico/src/ml/"+type+"/",
				"type": type,
				"min": (min) ? true : false,
				"embed": false,
				"avoid": true // Don't write the files
			}],
			custom = new CustomBuild(packages, "ml", true); // to avoid create the zip file send last argument true
			custom.avoidCompress();
			custom.on( "processed" , function( data ) {
				res.header('Content-Type', (type==="js") ? "text/javascript" : "text/css" );
				res.send( data );
			});
		
});

/**
 * Download
 */

	var versions = [],
		folders = fs.readdirSync( __dirname + "/public/versions/");
		
	if (folders) {
		folders.forEach(function(folder) {
			var version = {version:folder, files:[]},
				subFolder = fs.readdirSync( __dirname + "/public/versions/" + folder);
			if (subFolder) {
				subFolder.forEach(function(file){
					version.files.push({label: file, href: "/versions/"+folder+"/"+file});
				});
			}
			versions.push(version);
		});
	}
	
	versions.sort();
	versions.reverse();
	console.log(versions)
	// Reorder
/*	var t = versions.length, temp = [];
	while (t--) {
		temp.push(versions[t]);
		console.log(versions[t])
	}
	versions = temp;*/

// get 
app.get('/download', function(req, res) {
	
	// new title
	var _meta = Object.create(meta);
		_meta.title = "Download Chico-UI.";
		_meta.versions = versions;

	res.render( 'download', _meta );
	
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
				use_mesh = req.body.mesh,
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
						"input": "../chico/src/js/",
						"components": abstracts.toLowerCase() + "," + utils.toLowerCase() + "," + components.toLowerCase(),
						"type": "js"
				}
		};

		// Stylesheets Pack
		var css = function() {
				return {
						"name": "chico",
						"input": "../chico/src/" + flavor + "/css/",
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
						"input": "../chico/src/" + flavor + "/css/",
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
				// JS
				var d_js = js();
				packages.push( d_js );
				// CSS
				var d_css = css();
				packages.push( d_css );
		}
		
		var custom = new CustomBuild(packages, flavor);
				custom.on("done", function( uri ) {
						res.send("<a href=\""+uri+"\">Download</a>");
						res.redirect(uri);
				});

});

/**
 * Snippets.
 */
// get
app.get('/snippets', function(req, res){
	res.render('snippets', meta );
});

/**
 * Discussion.
 */
// get
app.get('/discussion', function(req, res){
	meta.title = "Discussion on Chico UI";
	res.render('discussion', meta );
});

/**
 * Getting started.
 */
// get
app.get('/getting-started', function(req, res){
	// new title
	meta.title = "Getting started with Chico UI";
	res.render('getting-started', meta );
});

/**
 * Docs.
 */

app.get('/docs',function(req, res){
		res.render('docs', meta);
});

app.get('/docs/:branch/:label?',function(req, res){
		var branch = req.params.branch,
			label = req.params.label;
			
			if(branch!=undefined && label!=undefined){
				var redefBranch = (branch=='how-to')?'howtos':branch;
				var url = '/docs/'+branch+'/'+label;
				items = meta[redefBranch];
				for(var i in items){
					if(items[i].href == url){
						res.render('docs/'+branch+'/'+label, meta );
						return;
					}
				}
				res.render('404', meta );
				return;
				//res.render('docs/'+brancDzh+'/'+label, meta );
			} else if(label==undefined){
				var url = '/docs/'+branch;
				items = meta.docs;
				for(var i in items){
					if(items[i].href == url){
						res.render('docs/'+branch, meta );
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
// get
app.get('/', function(req, res, next){

    if (req.headers.host.indexOf("download")>-1){
    	next();
    }

	res.render('index', meta );
});

/**
 * app start
 */ 
app.listen(8080);

/**
 * log
 */
console.log("Express server listening on port %d", app.address().port);