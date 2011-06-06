
var sys = require('sys'),
    app = require('express').createServer();

/**
 *		app settings
 */

app.set('view engine', 'jade');

/**
 *		app routing
 */
 
app.get('/', function(req, res) {
  
    res.render( 'index', { title : title } );

});