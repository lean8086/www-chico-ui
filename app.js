
/**
 * module dependencies.
 */

var express = require('express'),
    events = require('events'),
    CustomBuild = require('./services/builder/custom_build').CustomBuild,
    Encode64 = require('./services/builder/encode64').Encode64;


var app = module.exports = express.createServer();

/**
 * constants.
 */
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

// Para lean
app.get( '/lastest/:type/:min?', function( req, res ) {
       
    var type = req.params.type;
    var min = req.params.min;
    
    var packages = [{
        "name": "chico",
        "input": "../chico/src/"+type+"/",
        "type": type,
        "min": (min) ? true : false,
        "embed_images": (req.params.embed_images) ? true : false
    }];
    
    var custom = new CustomBuild( packages );
        custom.avoidCompress();
        custom.on( "processed" , function( data ) {
            res.header('Content-Type', (type==="js") ? "text/javascript" : "text/css" );
            res.send( data );
        });
    
});



app.get( '/encode', function( req, res ) {
    
    var encodedImage = new Encode64("./public/src/assets/ninja.jpg");
    
        encodedImage.on( "encoded", function( data ){
            res.send( data.toString() ); 
        });
    
});

/**
 * Download
 */
// get 
app.get( '/download', function( req, res ) {
    
  res.render( 'download', {
    title: 'Chico-UI',
    navigation: navigation
  });
  
});

// post 
app.post('/download', function( req, res ){

    var components = req.body.class.join(",").toLowerCase(),
        flavor = req.body.flavor,
        mesh = req.body.mesh,
        min = ( req.body.min == "p" ) ? true : false ;
        embed = req.body.embed;
    
    // JavaScripts Pack
    var js = {
        "name": "chico",
        "input": "../chico/src/js/",
        "components": req.body.abstract.join(",").toLowerCase() + "," + req.body.util.join(",").toLowerCase() + "," + components,
        "type": "js"
    };
    
    // Stylesheets Pack
    var css = {
        "name": "chico",
        "input": "../chico/src/css/",
        "components": components + ( (mesh) ? ",mesh" : "" ),
        "type": "css"
    };
    
    // Flavors Pack
    var flavor = {
        "name": "flavor",
        "components": components,
        "type": "css"
    };
    
    // Min?
    js.min = css.min = flavor.min = ( min ) ? true : false ;

    // Embed?
    css.embed = flavor.embed = ( embed ) ? true : false ;
    
    // Pack the thing
    var packages = [ js , css /*, flavor*/ ];
    console.log(packages);
    var custom = new CustomBuild( packages );
        custom.on("done", function( uri ) {
            res.redirect( uri );
        });
});

/**
 * Index.
 */
// get
app.get('/', function(req, res){
  res.render('index', {
    title: 'Chico-UI',
    navigation: navigation
  });
});


/**
 * app start
 */
app.listen(3000);

/**
 * log
 */
console.log("Express server listening on port %d", app.address().port);