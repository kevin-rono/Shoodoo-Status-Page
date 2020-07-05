const axios           = require('axios');
const restUrlClient   = require('../shared-util/utils');
const ip              = require('ip');
const timestamp       = require('time-stamp');
let   date            = require('date-and-time');

require('dotenv').config();

const LOG     = console.log;

/**
 * Server object construction.
 */
const Server = function()
{
    LOG("Poller started");
    // The tasker instance, which the server main loop operates on.
    this._tasker_instance = null;

    this.host = process.env.API_HOST;
    this.port = process.env.API_SERVER_PORT;
    this.ver  = process.env.API_VER;

    this.uri = `${this.host}/api/${this.ver}`;

} // end server..


/**
 * Assigns the Server's tasker instance.
 * @param {Tasker} instance The instance.
 */
Server.prototype.assignTasker = function ( instance )
{
    this._tasker_instance = instance;
}

/**
 * The poller tick function, main work of the poller.
 */
Server.prototype.tick = function ( self )
{
    let now = new Date();

    LOG( date.format(now, 'YYYY/MM/DD HH:mm:ss') + " - Shoodoo Poller is waiting..") ;
 
    let sUrl;
    sUrl = `${self.uri}/endpoints`;

    axios.get(sUrl, { headers: { 'x-access-token': process.env.SERVER_JWT } }).then(res => {
        res.data.endpoints.forEach(element => {
            
            sUrl =  `${self.uri}${element.endpoint}`;
            pUrl =  `${self.uri}/endpoints-statuses`;
            nUrl =  `${self.uri}/close-endpoints`;

            //////////
            axios.get(sUrl, { headers: { 'x-access-token': process.env.SERVER_JWT } }).then(res => {
                console.log("calling endpoint : " + element.endpoint + " is OK !" ); 

                /**
                 * closing endpoints that get fixed
                 *
                /
                axios.get(nUrl, { endpoint: element.endpoint }, { headers: { 'x-access-token': process.env.SERVER_JWT } }).then(res => {
                    console.log("open endpoint closed");
                }).catch(err => {
                    console.error(err.message);
                });
                */

            }).catch(err => {
                console.error("error calling : " + element.endpoint + '. ');

                axios.post(pUrl, { endpoint: element.endpoint, message: 'endpoint is down', error: err.message }, { headers: { 'x-access-token': process.env.SERVER_JWT } }).then(res => {
                    console.log("recorded error: " + element.endpoint); 
                }).catch(err => {
                    console.error("error recording : " + element.endpoint + '. ');
                });
            });
            //////////

        });

    }).catch(err => {
        console.error("error: " + err);
    })


/**
 * ToDo: replace to Axios
 * Check status of running Jobs.
 * If still running - call cb (?)
 * if done - check if all child process are done.
 * @param {cb }      callback function to call
 *
 * http://localhost:1337/api/v1/backend/getJobStatus?type=solution&id=11
 */
Server.prototype.serverRegister = function (_self, sStatus)
{
    console.log("Register Server");
    let callString;
    let theUrl;
    const tName = 'Shoodoo_App';
    const ipAddr = ip.address();
    const sName =  'Shoodoo-Server';
    const tStamp = Date.now();

    callString = '/registerServer?serverName=' + tName + '&sIp=' + ipAddr + '&tStamp=' + tStamp + '&sType=' + sName + '&sStatus=' + sStatus;
    //ToDo: change ver after setting the required func on v2
    //theUrl = _self.host + `/api/${_self.ver}` + callString;
    theUrl = _self.host + `/api/v2` + callString;
    const optionsget = {
        //host : _self.host,
        uri : callString,
        //port : _self.port,
        //path : `/api/${_self.ver}` + callString,
        //method : 'GET',
        headers: {
            'x-access-token': process.env.SERVER_JWT
        }
    };

   //return (new restClient( optionsget, false )) ;
    return (new restUrlClient( theUrl )) ;
};

}
module.exports = Server;
