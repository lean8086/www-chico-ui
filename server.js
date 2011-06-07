
var sys = require('sys'),
    app = require('express').createServer();

/**
 *		app settings
 */

//app.set('view engine', 'jade');

/**
 *		app routing
 */

app.get('/', function(req, res) {
    
    req.params
        
    res.render( 'index', { title : title, data: {} } );

});