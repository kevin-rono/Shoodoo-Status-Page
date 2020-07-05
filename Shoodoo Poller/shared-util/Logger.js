const path     = require('path');
var fs         = require('fs');


var Logger = exports.Logger = {};

//var infoStream  = fs.createWriteStream( path.join(process.env.LOGGING_LOG_DIRECTORY, process.env.LOGGING_TRANSPORT_FILE_NAME ) );
var infoStream  = fs.createWriteStream('info.txt');

//var errorStream = fs.createWriteStream( path.join(process.env.LOGGING_LOG_DIRECTORY, process.env.ERROR_LOG_FILE ) );
var errorStream = fs.createWriteStream('error.log');

var info = function(msg) {
    var message = new Date().toISOString() + " : " + msg + "\n";
    infoStream.write(message);
}

var error = function(msg) {
    var message = new Date().toISOString() + " : " + msg + "\n";
    errorStream.write(message);
}

module.exports = Logger;


/**
 * Create the Logger
 * @param {string} host The hostname.
 * @param {string} application directory
 */
var sdLogger = function ( logLevel , logDir, _logFile)
{
    this.logLevel     = logLevel || "debug";
    this.logDir       = logDir || "logs";
    this.logFile      = path.join( this.logDir.toString() , _logFile.toString()) || "server.log";

    console.log("Log file created: " + this.logFile);

    winston.level     = this.logLevel;

    this.logger       = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)(),
            new (winston.transports.File)({ filename: this.logFile })
        ]
    });
}

/**
 * Write log message
 * @param {Message} msg message to log
 */
sdLogger.prototype.logMsg = function( msg )
{
    var self = this;

    self.logger.log(this.logLevel, msg);

    /*if(err){
        throw err;
    }*/
}

LogSeverity = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    VERBOSE: 3,
    DEBUG: 4,
    SILLY: 5
};

module.exports = LogSeverity;
module.exports = sdLogger;

