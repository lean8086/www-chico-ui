/**
 * Encode64 Class.
 * @class Builder
 * @autor Natan Santolo <natan.santolo@mercadolibre.com>
 * @returns {String} Image data encoded Base64
 */
 
var sys = require("sys"),
    fs = require("fs"),
    events = require('events'),
    version = "1.1";

var Encode64 = function( o ) {
/*
    sys.puts( " ______                     _        __ _  _   " );
    sys.puts( "|  ____|  "+version+"              | |      / /| || |  " );
    sys.puts( "| |__   _ __   ___ ___   __| | ___ / /_| || |_ " );
    sys.puts( "|  __| | '_ \\ / __/ _ \\ / _` |/ _ \\ '_ \\__   _|" );
    sys.puts( "| |____| | | | (_| (_) | (_| |  __/ (_) | | |  " );
    sys.puts( "|______|_| |_|\\___\\___/ \\__,_|\\___|\\___/  |_|  " );
    sys.puts( " " );
*/
    var self = this;
        self.image_data;
        self.encoded_data;
        self.image = o || "";

        self._toBase64( o );
};

// Inherit from EventEmitter
Encode64.prototype = new events.EventEmitter();

Encode64.prototype._toBase64 = function( o ) {

    var self = this;

    self.image_data = fs.readFileSync( o );
                
    self.emit( "processed" , self.image_data );

    self.encoded_data = "data:image/png;base64," + new Buffer(self.image_data.toString(), 'binary').toString( 'base64' );

    self.emit( "encoded" , self.encoded_data );

}

/* -----[ Exports ]----- */
exports.version = version;
exports.Encode64 = Encode64;