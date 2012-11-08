// Include modules
var sys = require("util"),
	fs = require("fs"),
	events = require("events"),
	express = require("express"),
	Downloader = require('./libs/downloader').Downloader,
	app = express.createServer(),
	port = process.argv[2] || 8080,
	countries = require("./models/countries").countries,
	meta;

// Configure webserver
app.configure(function () {
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.static(__dirname + "/public"));
	app.set("views", __dirname + "/views");
	app.set("view engine", "jade");
});

/*
* Dynamic Helpers
* Simply functions that are invoked per request (once), passed both the request and response objects.
* These can be used for request-specific details within a view, such telling the layout which scripts to include.
*/

app.dynamicHelpers({
	"script": function (req, type, source) {

		req._get = [];
		req._code = [];

		var script = function (type, source) {

			if (typeof type  === "undefined") { return; }
			if (typeof source === "undefined") { return req["_" + type];}

			req["_" + type].push(source);
		};

		return script;
	}

});


/*
*  Helpers
*/
function ucfirst(string) {
	return string.charAt(0).toUpperCase() + string.substr(1);
}

function friendly(string, type) {

	// From "how-to-make-something" to "How to make something"
	if (type !== "widgets") { return ucfirst(string).replace(/\-/g, " "); }

	// From "auto-complete" to "Auto Complete"
	var a = [];

	string.split("-").forEach(function (word, i) {
		a[i] = ucfirst(word);
	});

	return a.join(" ");
}

function camelCase(string) {

	// From "auto-complete" to "autoComplete"
	var a = [];

	string.split("-").forEach(function (word, i) {
		a[i] = (i > 0) ? ucfirst(word) : word;
	});

	return a.join("");
}

function createNavMap(type) {

	// Final result
	var r = [],

	// Regexp to be replaced into filenames
		blacklist = new RegExp("(.jade)|(.ds_store,)", "gi"),

	// Get filenames into folder and delete files in "the blacklist" and file extension
		files = fs.readdirSync(__dirname + "/views/" + type).sort().join(",").replace(blacklist, "");

	// Get into each filename
	files.split(",").forEach(function (file) {
		// Add an object
		r.push({
			"name": file,
			"href": "/" + type + "/" + file,
			"friendly": friendly(file, type)
		});
	});

	return r;
}

/*
*  Object that transports layout name, guides list, widgets list, title, etc.
*/
meta = {
	"widgets": createNavMap("widgets"),
	"guides": createNavMap("guides"),
	"title": "Chico UI, MercadoLibre's open source web tools.",
};

// Order versions foldernames into an array
meta.versions = (function () {

	// Get filenames into folder and delete files in "the blacklist" and file extension
	var folders = fs.readdirSync(__dirname + "/public/versions").sort(),

	// Versions lower than 0.10 (not inclusive): 0.9, 0.8, etc.
		versions = [],

	// Versions greater than 0.10 (inclusive): 0.10, 0.11, etc.
		gt = [];

	// Classify each version
	folders.forEach(function (v) {

		if (v === "latest" || v === "assets" || v === ".DS_Store") { return; }

		// Object containing data of each version
		var o = {
			"version": v,
			"files": []
		};

		// Files inside version folder
		fs.readdirSync(__dirname + "/public/versions/" + v).forEach(function (name) {

			if (name === ".DS_Store") { return; }

			o.files.push({
				"name": name,
				"href": "/versions/" + v + "/" + name
			});
		});

		if (v.split(".")[1] < 10) {
			versions.push(o);
		} else {
			gt.push(o);
		}
	});

	// Sort both arrays
	versions.sort();
	gt.sort();

	// Add latest versions to main array
	gt.forEach(function (v) {
		versions.push(v);
	});

	// Reorder versions
	versions.reverse();

	// Set latest version
	meta.version = versions[0].version;

	// Return all sorted versions
	return versions;

}());


/*
*  Routing exceptions
*/

app.get("/blog", function (req, res) {
	res.redirect("http://blog.chico-ui.com.ar/");
});

app.get("/api", function (req, res) {
	res.redirect("/api/" + meta.version + "/index.html");
});

app.get("/archive", function (req, res) {
	meta.layout = "layout_2cols";
	res.render("archive", meta);
});

app.get("/404", function (req, res) {
	meta.layout = "layout_2cols";
	meta.title = "Chico UI | Error";

	res.render("404", meta);
});


/*
*  Downloader
*/

app.post('/download', function (req, res) {

	// Instance a Downloader
	var downloader = new Downloader();

	// Listen to the Downloader response to redirect to the .zip file to download
	downloader.on('done', function (url) {
		res.redirect(url);
	});

	// Initialize Downloader
	// TODO: The input must be variable for mobile download
	downloader.run(req.body);
});

/*
*  Autosuggest resource routing
*/

app.get("/suggest", function (req, res) {

	var result = [],

		i = countries.length;

	while (i -= 1) {
		if (!countries[i].toLowerCase().search(req.query.q.toLowerCase())) {
			result.push("\"" + countries[i] + "\"");
		}
	}

	res.header("Content-Type", "text/javascript");
	res.send(req.query.callback + "([" + result + "])");
});


/*
*  AppCache
*/
app.get("/chico.appcache", function (req, res, next) {
	res.header("Content-Type", "text/cache-manifest");
	res.sendfile(__dirname + "/chico.appcache");
});


/*
*  Routing
*/

// Homepage
app.get("/", function (req, res) {

	meta.layout = "layout_1col";
	meta.selected = "";
	meta.title = "Chico UI, MercadoLibre's open source web tools.";

	res.render("index", meta);
});

// Sections (L1)
app.get("/:section", function (req, res) {

	meta.layout = "layout_1col";
	meta.title = "Chico UI | " + ucfirst(req.params.section);
	meta.selected = req.params.section || null;

	res.render(req.params.section, meta);
});

// Widgets, Guides, etc. (L1 + L2)
app.get("/:section/:file", function (req, res) {

	meta.layout = "layout_2cols";
	meta.friendly = friendly(req.params.file, req.params.section);
	meta.camelCase = camelCase(req.params.file);
	meta.capital = ucfirst(meta.camelCase);
	meta.title = "Chico UI | " + ucfirst(req.params.section) + " | " + meta.friendly;
	meta.selected = req.params.section;

	res.render(req.params.section + "/" + req.params.file, meta);
});


/*
*  Init
*/

// Initialize application
app.listen(port);

// Feedback
console.log("Server running on port " + port);