const nodejs_config = require('nodejs-config');


var Message = function ( uid, data )
{
    if(typeof uid === 'undefined')
    {
        throw new Error('Unique ID can\'t be undefined.');
    }
    
    if(typeof data !== 'object')
    {
        data = { data: data };
    }

    this.uid = uid;
    this.data = data || {};
    this.ToJSON = function()
    {
        return JSON.stringify(this);
    }
}

Message.FromJSON = function ( json )
{
    return JSON.parse(json);
}

Message.Messages = nodejs_config(__dirname + '\\..\\', {}).get('messages');


module.exports = Message;
