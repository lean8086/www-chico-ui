// Include modules
var sys = require("util"),
	fs = require("fs"),
	events = require("events"),
	express = require("express"),
	Packer = require("../chico/libs/packer/packer").Packer,
	app = express.createServer(),
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

		script(type, source);

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
	"label": "test",
	"instanceLabel": "test"
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
		
		if (v === "latest" || v === "assets") { return; }
		
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
	res.redirect("/api/" + meta.version + "/symbols/ch.html");
});

app.get("/404", function (req, res) {
	meta.layout = "layout_2cols";
	meta.title = "Chico UI | Error";
	
	res.render("404", meta);
});


/*
*  Downloader
*/

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

/*
*  Autosuggest resource routing
*/

app.get("/suggest", function (req, res) {
	
	var countries = ["Afghanistan", "Akrotiri", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Ashmore and Cartier Islands", "Australia", "Austria", "Azerbaijan", "Bahamas, The", "Bahrain", "Bangladesh", "Barbados", "Bassas da India", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Clipperton Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Cook Islands", "Coral Sea Islands", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Dhekelia", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Europa Island", "Falkland Islands (Islas Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern and Antarctic Lands", "Gabon", "Gambia, The", "Gaza Strip", "Georgia", "Germany", "Ghana", "Gibraltar", "Glorioso Islands", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See (Vatican City)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Jan Mayen", "Japan", "Jersey", "Jordan", "Juan de Nova Island", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nauru", "Navassa Island", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paracel Islands", "Paraguay", "Peru", "Philippines", "Pitcairn Islands", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Spratly Islands", "Sri Lanka", "Sudan", "Suriname", "Svalbard", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tromelin Island", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands", "Wake Island", "Wallis and Futuna", "West Bank", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"],
	
		result = [],
		
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
*  Routing
*/

// Homepage
app.get("/", function (req, res) {
	
	meta.layout = "layout_1col";
	
	res.render("index", meta);
});

// Sections (L1)
app.get("/:section", function (req, res) {
	
	meta.layout = "layout_1col";
	meta.title = "Chico UI | " + ucfirst(req.params.section);
	
	res.render(req.params.section, meta);
});

// Widgets (L1 + L2)
app.get("/:section/:file", function (req, res) {
	
	meta.layout = "layout_2cols";
	meta.title = "Chico UI | " + ucfirst(req.params.section) + " | " + friendly(req.params.file, req.params.section);
	
	res.render(req.params.section + "/" + req.params.file, meta);
});


/*
*  Init
*/

// Initialize application
app.listen(process.argv[2] || 8080);

// Feedback
console.log("Server running...");