const http    = require('http');
var   request = require('request');
const LOG     = console.log;

// Call for rest service
/**
* Client call to a rest service
* @param { options } optionStr = { host : host, port : port, path : path, method : 'GET' }
* @param { apikey  } client apikey
* @param { doLog   } log activity ? true/false
*/
var restClient = function ( options, doLog) {
    LOG("restClient:\nhost: " + options.host + "\nport: " + options.port + "\npath: " + options.path);
    var reqGet = http.request(options, function(res) {
        res.on('data', function(d) {
            if (doLog) {
                //process.stdout.write(d);
                console.log("REST Data: " + d);
            }
            return d;
        });
    });
    reqGet.end();
    reqGet.on('error', function(e) {
        if (doLog) {
            console.log("utils - ERROR restClient");
            console.error(e);
        }
        return e;
    });
} // END


var restReqClient = function ( options )
{
    console.log("Rest option to call : " + JSON.stringify(options));

    function onError(e)
    {
        return console.error(`Service Error: ${e} `+ 'Check API SERVER');
    }

    request(options , callBack ) ;

    function callBack(error, response, body)
    {
        if (!error ) {
            if (response.statusCode == 200) {
                var info = JSON.parse(body);
                console.log("Rest info: " + info);
            }
        }
        else {
            console.log("rest error: " + error);
        }
    } /*).on('error', onError);*/

} // END restReqClient

var restUrlClient = function ( _url )
{
    //console.log("restURL : " + _url);

    request(_url, function (error, response, body) {
        if (error){
            console.log("Rest error: " + error);
        }
        /*else {
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        }*/
    });

} // END restReqClient




module.exports = restClient;
module.exports = restReqClient;
module.exports = restUrlClient;