const path     = require('path');
var fs         = require('fs');
//var winston    = require('winston');

/**
 * Create the Logger
 * @param {string} host The hostname.
 * @param {string} application directory
 */
var sdLogger = function ( logLevel , logDir, _logFile, _errorFile)
{
    var self = this;
    self.logLevel = logLevel || "debug";
    self.logDir   = logDir || "logs";

    self.infoStream  = fs.createWriteStream( path.join( logDir, _logFile ) );

    self.errorStream = fs.createWriteStream( path.join(logDir, _errorFile ) );

    console.log("Log file created : " + _logFile);
}

/**
 * Write log message
 * @param {Message} msg message to log
 */
sdLogger.prototype.logMsg = function(msg, ilogLevel) {
    var message = new Date().toISOString() + " : " + msg + "\n";

    if ((ilogLevel == LogLevel.CONSOLE_AND_FILE) || (ilogLevel == LogLevel.CONSOLE_ONLY) ) {
        console.log(message);
    }
    else if ( (ilogLevel == LogLevel.FILE_ONLY) || (ilogLevel == LogLevel.CONSOLE_AND_FILE)  ) {
        this.infoStream.write(message);
    }
    else
        return;
}

/**
 * Write ERROR log message
 * @param {Message} msg message to log
 */
sdLogger.prototype.logError = function(msg, ilogLevel) {
    var message = new Date().toISOString() + " : " + msg + "\n";

    if ((ilogLevel == LogLevel.CONSOLE_AND_FILE) || (ilogLevel == LogLevel.CONSOLE_ONLY) ) {
        console.log(message);
    }
    else if ( (ilogLevel == LogLevel.FILE_ONLY) || (ilogLevel == LogLevel.CONSOLE_AND_FILE)  ) {
        this.errorStream.write(message);
    }
    else
        return;
}

LogLevel = {
    CONSOLE_AND_FILE: 0,
    CONSOLE_ONLY: 1,
    FILE_ONLY: 2,
    NO_LOG: 3
};

/*
LogLevel = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    VERBOSE: 3,
    DEBUG: 4,
    SILLY: 5
};
*/
module.exports = LogLevel;
module.exports = sdLogger;

