
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

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
    
    // JavaScripts
    var js = {
        "name": "chico",
        "input": "../../src/js/",
        "components": req.body.abstract.join(",").toLowerCase() + "," + req.body.util.join(",").toLowerCase() + "," + components,
        "type": "js"
    };
    
    // Stylesheets
    var css = {
        "name": "chico",
        "input": "../../src/css/",
        "components": components + ( (mesh) ? ",mesh" : "" ),
        "type": "css"
    };
    
    // Flavors
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
    
    // Sanity check
    console.log(packages);

    res.send("Post data in?");
/*  

[
  {
    "name": "chico-c012-js",
    "input": "../../src/js/",
    "components": ["core,tooltip,layer,object,coso,other"],
    "type": "js",
    "min": "both",
    "download": true
  },
  {
    "name": "chico-c012-css",
    "input": "../../src/css/",
    "components": ["core,tooltip,layer,object,coso,other"],
    "type": "css",
    "embed_images": true,
    "min": "both",
    "download": true
  },
  {
    "name": "chico-c012-flavor",
    "input": "../../src/css/flavors/",
    "components": ["core,tooltip,layer,object,coso,other"], 
    "type": "css",
    "embed_images": true,
    "min": "both",
    "download": true
  }
]
*/

});


// Index
app.get('/', function(req, res){
  res.render('index', {
    title: 'Chico-UI'
  });
});

app.listen(3000);

console.log("Express server listening on port %d", app.address().port);
