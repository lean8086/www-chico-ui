/*!
 * Downloader
 * Creates a .zip file with neccesary resourses of Chico.
 */
(function () {
	'use strict';

	var sys = require('util'),
		fs = require('fs'),
		events = require('events'),
		exec = require('child_process').exec,
		Joiner = require('../../../chico/libs/joiner').Joiner;

	// Alias for 'sys.puts'
	function log(str) {
		sys.puts(' > Downloader: ' + str);
	}

	/**
	 * Contructor
	 */
	function Downloader() {

		log('Initializing... Reading the configuration file.');

		// Grab the configuration file to local reference
		this.conf = JSON.parse(fs.readFileSync(__dirname + '/conf.json'));

		// Tasks to execute to finish a package
		var progress = 0;

		this.total = 0;

		this.checkProgress = function () {
			if ((progress += 1) === this.total) {
				this.compress();
			}
		};

		return this;
	}

	/**
	 * Event emitter
	 */
	sys.inherits(Downloader, events.EventEmitter);


	Downloader.prototype.compress = function () {

		var self = this,
			zipname = 'chico-' + self.conf.pkg.version + '.zip',
			redirect = '/downloads/temp' + self.random + '/' + zipname,
			bash = [
				'cd ' + self.folder,
				'zip -r ' + zipname + ' *',
				'rm -r *.md *.txt *.html assets/ js/ css/'
			].join(' && ');

		log('Creating the zip file ' + zipname);

		exec(bash, function (err) {

			if (err) { log(err); }

			log('Process DONE! Redirecting to ' + redirect);

			self.emit('done', redirect);
		});
	};

	Downloader.prototype.createStructure = function () {

		var self = this;

		this.random = Math.floor(Math.random() * 999999);

		this.folder = './public/downloads/temp' + this.random;

		this.total += 4;

		log('Creating the temporary folder (temp' + this.random + ') and its internals folders.');
		exec('mkdir ' + this.folder + ' ' + this.folder + '/js ' + this.folder + '/css', function () {
			self.checkProgress();
		});

		log('Copying assets.');
		exec('cp -r ../chico/src/shared/assets ' + this.folder + '/assets', function () {
			self.checkProgress();
		});

		log('Copying Readme and License files.');
		exec('cp ../chico/README.md ../chico/LICENSE.txt ' + this.folder, function () {
			self.checkProgress();
		});

		log('Copying jQuery.');
		exec('cp ../chico/vendor/jquery.js ' + this.folder + '/js', function () {
			self.checkProgress();
		});
	};


	Downloader.prototype.addExtras = function () {

		var self = this,
			extras = this.params.extras,
			folder = this.folder;

		// Convert into array ALWAYS
		extras = Array.isArray(extras) ? extras : [extras];

		this.total += extras.length;

		extras.forEach(function (extra) {

			log('Copying ' + extra);

			switch (extra) {
			case 'mesh':
				exec('cp ../chico/src/shared/css/ch.mesh.css ' + folder + '/css/chico-mesh.css', function () {
					self.checkProgress();
				});
				break;
			/*case 'tests':
				// TODO: move jasmine css + js too
				exec('cp -r ../chico/tests ' + folder + '/tests', function () {
					exec('cp -r ../chico/libs/jasmine-1.2.0 ' + folder + '/tests/jasmine-1.2.0', function () {
						self.checkProgress();
					});
				});
				break;*/
			}
		});
	};


	Downloader.prototype.addHTML = function () {

		log('Copying HTML files.');

		var self = this,
			version = this.conf.pkg.version,
			indexIn = '../chico/views/ui.html',
			indexOut = this.folder + '/ui.html',
			// When user doen't request for a minified version, replace the
			// index.html routes to use the max version
			useMin = Array.isArray(this.params.compression) || this.params.compression === 'prod';

		this.total += 1;

		exec('cp ' + indexIn + ' ../chico/views/ajax.html ' + this.folder, function (err) {

			if (err) { log(err); }

			// Replace routes into the main HTML file
			fs.readFile(indexOut, function (err, data) {

				if (err) { log(err); }

				data = data.toString();

				// Replace routes
				data = data.replace('/ui/css', 'css/chico' + (useMin ? '-min-' : '-') + version + '.css');
				data = data.replace('/ui/js', 'js/chico' + (useMin ? '-min-' : '-') + version + '.js');
				data = data.replace('../vendor/jquery-debug.js', 'js/jquery.js');

				log('Replacing the css + js routes into the HTML index.');

				fs.writeFile(indexOut, data, function () {
					self.checkProgress();
				});
			});
		});
	};


	Downloader.prototype.getAllFiles = function () {

		var self = this,
			joiner = new Joiner(),
			version = self.conf.pkg.version,
			types = ['js', 'css'],
			compressions = self.params.compression;

		compressions = Array.isArray(compressions) ? compressions : [compressions];

		this.total = types.length * compressions.length;

		joiner.on('joined', function (data) {

			// Example: chico-min-0.12.js
			var filename = 'chico' + (data.min ? '-min-' : '-') + version + '.' + data.type,
				// Folder + Filename
				path = self.folder + '/' + data.type + '/' + filename;

			// Get inside the output folder and create the file to write
			exec('touch ' + path, function (err) {

				if (err) { log(err); }

				// Put content into the created file
				fs.writeFile(path, data.raw, function (err) {

					if (err) { log(err); }

					log('Done writting ' + filename);

					self.checkProgress();
				});
			});
		});

		types.forEach(function (type) {
			compressions.forEach(function (compression) {
				joiner.run('ui' + type.toUpperCase(), (compression === 'prod'));
			});
		});
	};


	Downloader.prototype.run = function (params) {

		this.params = params;

		// Feedback
		log('Initializing on v' + this.conf.pkg.version);

		this.createStructure();
		this.addExtras();
		this.addHTML();

		//if (params.widgets.length === parseInt(params.totalWidgets, 10)) {
			this.getAllFiles();
		//} else {
		//	this.getSpecificFiles();
		//}
	};


	/**
	 * Exports
	 */
	exports.Downloader = Downloader;

}());