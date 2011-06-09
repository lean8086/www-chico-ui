
/**
 * Module dependencies.
 */

var express = require('express'),
    events = require('events');

var app = module.exports = express.createServer();

// Mocks
var CustomBuild = function( packages ) {
    var self = this;
        self.packages = packages;
}
CustomBuild.prototype = new events.EventEmitter();
CustomBuild.prototype.run = function() {
    var self = this;
        self.emit( "done" , "http://download.chico-ui.com.ar/" );
        console.log( self.packages );
}

// Constants

var navigation = {

    "top": [
        {"label": "Home", "href": "/"},
        {"label": "Download", "href": "/download"},
        {"label": "Getting Started", "href": "https://github.com/mercadolibre/chico/wiki"},
        {"label": "API", "href": "/api/index.html"},
        {"label": "Docs", "href": "/docs/index.html"},
        {"label": "Github", "href": "https://github.com/mercadolibre/chico/"}
    ],
    
    "bottom": {
        "Download": [
            {"label": "Download", "href": "/"},
            {"label": "Current release", "href": "/download"},
            {"label": "Past releases", "href": "http://download.chico-ui.com.ar/"},
            {"label": "Source code", "href": "https://github.com/mercadolibre/chico/"}
        ],
        "Getting started": [
            {"label": "Getting started", "href": "/"},
            {"label": "How to install", "href": "/"},
            {"label": "Using Chico-UI", "href": "/"},
            {"label": "Layout with Mesh", "href": "/"}
        ],
        "Docs": [
            {"label": "Docs", "href": "/api/index.html"},
            {"label": "API Reference", "href": "/api/index.html"},
            {"label": "How to install", "href": "/docs/how-to-install"},
            {"label": "Examples", "href": "/examples"}
        ],
        "Support": [
            {"label": "Support", "href": "/support/faq"},
            {"label": "FAQ", "href": "/support/faq"},
            {"label": "Issue tracker", "href": "https://github.com/visionmedia/jade/issues"},
            {"label": "Mailing list", "href": "https://groups.google.com/group/chico-ui"}
        ],
        "Get in touch": [
            {"label": "Get in touch", "href": "/"},
            {"label": "on Twitter", "href": "http://twitter.com/chicoui"},
            {"label": "on Facebook", "href": "http://www.facebook.com/pages/Chico-UI/189546681062056"},
            {"label": "our Google Group", "href": "https://groups.google.com/group/chico-ui"}
        ]
    }

}


// Configuration

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

// Routes

// get Downloads
app.get('/download', function(req, res){
  res.render('download', {
    title: 'Chico-UI'
  });
});

// post Downloads
app.post('/download', function(req, res){

    console.log(req.body);

    var components = req.body.class.join(",").toLowerCase(),
        flavor = req.body.flavor,
        mesh = req.body.mesh,
        min = req.body.min;
        embed = req.body.embed;
    
    // JavaScripts Pack
    var js = {
        "name": "chico",
        "input": "../../src/js/",
        "components": req.body.abstract.join(",").toLowerCase() + "," + req.body.util.join(",").toLowerCase() + "," + components,
        "type": "js"
    };
    
    // Stylesheets Pack
    var css = {
        "name": "chico",
        "input": "../../src/css/",
        "components": components + ( (mesh) ? ",mesh" : "" ),
        "type": "css"
    };
    
    // Flavors Pack
    var flavor = {
        "name": "flavor",
        "components": components,
        "type": "css"
    };
    
    if (min) {
        js.min = true;
        css.min = true;
        flavor.min = true;    
    }
    
    if (embed) {
        css.embed = true;
        flavor.embed = true;            
    }
    
    // Pack the thing
    var packages = [ js , css /*, flavor*/ ];
    
    var custom = new CustomBuild( packages );
        custom.on("done", function( uri ) {
            res.redirect( uri );
        });
        custom.run();
});


// Index
app.get('/', function(req, res){
  res.render('index', {
    title: 'Chico-UI',
    navigation: navigation
  });
});

app.listen(3000);

console.log("Express server listening on port %d", app.address().port);