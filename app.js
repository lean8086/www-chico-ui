// Include modules
var express = require('express'),
    app = express.createServer(),
    port = process.argv[2] || 8080,
    meta = {
        'title': 'Chico UI, MercadoLibre\'s open source web tools.',
        'layout': 'layout_1col'
    };

// Configure webserver
app.configure(function () {
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
});

/**
 * Dynamic Helpers
 * Simply functions that are invoked per request (once), passed both the request and response objects.
 * These can be used for request-specific details within a view, such telling the layout which scripts to include.
 */
app.dynamicHelpers({
    'script': function (req, type, source) {

        req._get = [];
        req._code = [];

        return function (type, source) {
            if (type === undefined) { return; }
            if (source === undefined) { return req['_' + type];}

            req['_' + type].push(source);
        };
    }
});

/**
 * Routing
 */
app.get('/', function (req, res) {
    res.render('index', meta);
});

app.get('/:section', function (req, res) {
    res.render(req.params.section, meta);
});

app.get('/:section/:file', function (req, res) {
    res.render(req.params.section + '/' + req.params.file, meta);
});

// Initialize application
app.listen(port);

// Feedback
console.log("Server running on port " + port);