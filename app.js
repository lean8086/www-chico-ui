	
/**
 * module dependencies.
 */

var express = require('express'),
		events = require('events'),
		sys = require('util'),
		fs = require('fs'),
		meta = require('./models/meta').meta,
		country = require('./models/country').country,
		Packer = require("../chico/libs/packer/packer").Packer,
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

// * Widgets
// auto-complete -> AutoComplete
// auto-complete -> Auto Complete
// auto-complete -> autoComplete
// * Guides
// change-modal-content -> Change modal content
var labeler = function (label) {
	
	var words = label.split("-"),
		
		self = {},
		
		ucfirst = (function () {
			
			var w = [];
			
			words.forEach(function (e, i) {
				if (i === 0) {
					w[0] = e.charAt(0).toUpperCase() + e.substr(1);
				} else {
					w.push(e);
				}
			});
			
			return w;
		}());
	
	self.ucfirst = ucfirst.join(" "); // Change modal content
	
	words.forEach(function (e, i) {
		if (i === 0) { return; }
		
		words[i] = ucfirst[i] = e.charAt(0).toUpperCase() + e.substr(1);
	});
	
	self.camel = words.join(""); // autoComplete

	self.capitalized = ucfirst.join(" "); // Auto Complete
	self.both = ucfirst.join(""); // AutoComplete

	return self;
};

var labelit = function(label, camel, friendly){
	
	var words = label.split("-");
	
	if (camel) {
		words.forEach(function (e, i) {
			if (i === 0) { return; }
			
			words[i] = e.charAt(0).toUpperCase() + e.substr(1)
		});
	} else {
		words[0] = words[0].charAt(0).toUpperCase() + words[0].substr(1);
	}
	
	return words.join(friendly ? " " : "");
}

var friendlyMap = {
	"widgets": "UI Widgets",
	"guides": "Learning guides"
};

var createNavigationMapFrom = function(folder){
	
	var temp = [],
	
		folders = fs.readdirSync(__dirname + "/views/" + folder).sort(),
		
		filename;

	folders.forEach(function (file) {
		
		filename = file.split(".jade").join("");
		
		if (filename === "home" || filename === ".DS_Store") { return; }
		
		var lbl = labeler(filename);
		
		temp.push({
			"label": (folder === "guides") ? lbl.ucfirst : lbl.capitalized,//labelit(filename, false, true),
			"href": "/" + folder + "/" + filename,
			"name": filename
		});
	});
	
	return temp;
}

meta.guides = createNavigationMapFrom("guides");

meta.widgets = createNavigationMapFrom("widgets");


// get 'builder.conf' and parse JSON data
meta.conf = JSON.parse(fs.readFileSync(__dirname + "/services/builder/builder.conf"));

// creates a collection of all versions inside /public/versions
meta.versions = (function(){
	var versions = [],
		temp = [],
		latest = [],
		// read versions folder
		folders = fs.readdirSync( __dirname + "/public/versions/");
	if (folders) {
		// Ignore some specific folders
		folders.forEach(function(folder) {
			// Like the assets and latest folder
			if (folder !== "assets" && folder !== "latest") {
				if (folder.split(".")[1] < 10) {
					versions.push(folder);
				} else {
					latest.push(folder);
				}
			}
		});
		
		versions.sort();
		latest.sort();
		
		latest.forEach(function (e) {
			versions.push(e);
		});

		// reorder versions
		//versions.sort();
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
		req._get = [];
		req._code = [];

		var script = function (type, source) {
			if (typeof type  === "undefined") { return; }

			if (typeof source === "undefined") {
				return req["_" + type];
			}
			req["_" + type].push(source);
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

app.get('/data/:file', function (req, res) {
	
	var contentType = {
		"png": "image/png",
		"css": "text/css",
		".js": "text/javascript",
	}
	
	var file = req.params.file,
	
        data = fs.readFileSync(__dirname + "/public/data/" + file);
        
   	res.header("Content-Type", contentType[file.substr(-2)]);
    res.send(data);

});


/**
* Static-demo
*/

app.get("/static-demo/:file", function (req, res) {
	var data = fs.readFileSync(__dirname + "/public/static-demo/" + req.params.file);
   	res.header("Content-Type", "text/html");
    res.send(data);
});


app.get('/beta', function(req, res, next){
	var data = fs.readFileSync(__dirname + "/beta/index.html");

	res.header('Content-Type', "text/html");
	res.send(data);
});


app.get('/api', function(req, res, next){
	res.redirect("/api/" + meta.latest.version + "/symbols/ch.html");
//	next();
});


app.get('/beta/:file', function(req, res, next){
	var contentType = {
		"png": "image/png",
		"css": "text/css",
		"js": "text/javascript",
	}
	var file = req.params.file,
        data = fs.readFileSync(__dirname + "/beta/"+file);

   	res.header('Content-Type', contentType[file.substr(-3)]);
    res.send(data);

});


/**
* Download
*/

// Get 
app.get("/download", function (req, res) {

	var opt = title("Download Chico UI");

	opt.layout = "1col";

	opt.breadcrumb = [
		["Download", ""]
	];

	res.render("download", opt);

});

// Post
app.post("/download", function (req, res) {
	
	// Construct joiner
	var packer = new Packer();

	// Listener that prints content of code
	packer.on("done", function (url) {
		res.redirect(url);
	});
	
	req.body.input = "../chico/src";
	
	// Initialize joiner with only one package
	packer.run(req.body);

});

/**
 * Discussion.
 */
// get
app.get('/discuss', function(req, res){
	
	var opt = title("Discuss on Chico UI");
	
	opt.layout = "1col";
		
	opt.breadcrumb = [
		["Discuss", ""]
	];
	
	res.render('discuss', opt);
});

/**
 * Docs.
 */

/*app.get('/get-started', function(req, res){
	var opt = title("Get started with Chico UI");

	opt.breadcrumb = [
		["Get Started", ""]
	];
	res.render('guides/get-started', opt);
});*/


app.get('/suggest', function(req, res){
	var q = req.query.q;
	var callback = req.query.callback;
		q.toLowerCase();
	var result = [];
		for(var a=(country.length-1);a;a--){
			var word = country[a].toLowerCase();
			var exist = word.search(q);
			if(!exist){
				result.push("\""+country[a]+"\"");
			}
		}
		var r = callback+"(["+result+"])";
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
	var opt = title("");
	
	opt.layout = "1col";
		
	opt.breadcrumb = [];
	
	res.render("index", opt);
});

/**
 * About.
 */
app.get('/about', function(req, res, next){
	
	var opt = title("About Chico UI");
	
	opt.layout = "1col";
		
	opt.breadcrumb = [
		["About us", ""]
	];
	
	res.render('about', opt);
});

/**
 * License.
 */
app.get('/license', function(req, res, next){
	
	var opt = title("Chico UI License");
	
	opt.layout = "1col";
		
	opt.breadcrumb = [
		["License", ""]
	];
	
	res.render("license", opt);
});


/**
 * About.
 */
app.get('/search', function(req, res, next){
	
	var opt = title("Chico UI - Search results");
	
	opt.layout = "layout";
		
	opt.breadcrumb = [
		["Search results", ""]
	];
	
	res.render('search', opt);
});


/**
 * Mesh.
 */
app.get('/mesh', function(req, res, next){
	
	var opt = title("Chico Mesh");

	opt.breadcrumb = [
		["Chico Mesh", ""]
	];
	
	res.render('mesh', opt);
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

app.get('/:branch/:label?', function(req, res){
	var branch = req.params.branch,
		label = req.params.label;
			
	if (branch != undefined && label != undefined) {
		
		var areGuides = branch === "guides",
		
			redefBranch = areGuides ? "guides" : branch,
		
			url = "/" + branch + "/" + label,
			
			lbl = labeler(label),
		
			opt = title("Chico UI | " + friendlyMap[branch] + " | " + (areGuides ? lbl.ucfirst : lbl.capitalized));
		
		opt.breadcrumb = [
			[friendlyMap[branch], "/" + branch],
			[(areGuides ? lbl.ucfirst : lbl.capitalized), ""] 
		];
		
		opt.label = lbl.both;
		opt.instanceLabel = lbl.camel;
		
	
		items = meta[redefBranch];
		for(var i in items){
			if(items[i].href == url){
				res.render(branch+'/'+label, opt);
				return;
			}
		}
		res.render('404', meta );
		return;
		
	} else if(label==undefined){
		
		var opt = title("Chico UI | " + friendlyMap[branch]);
		
		opt.breadcrumb = [
			[friendlyMap[branch], ""]
		];

		
		//var url = '/'+branch;
		//items = meta.docs;
		//for(var i in items){
		//	if(items[i].href == url){
				res.render(branch+'/home', opt);
		//		return;
	//		}
	//	}
		//res.send("Error 404 | Branch: "+branch+", Label: "+label);
	//	res.render('404', meta );
		return;
	}
	//res.send("Error 404 | Branch: "+branch+", Label: "+label);
	res.render('404', meta );
	return;
});


/**
* app start
*/
app.listen(port);

/**
* log
*/
console.log("Express server listening on port %d", app.address().port);
