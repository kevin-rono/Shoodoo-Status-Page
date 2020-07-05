const amqp = require('amqplib/callback_api');

/**
 * Creates a RabbitMQ Session.
 * @param {string} host The hostname.
 */
var RabbitMQ = function ( host )
{
    this.hostname = host;
    this.connection = null;
}

/**
 * Connects to the RabbitMQ server.
 * @param {Function} func The function callback for connection.
 */
RabbitMQ.prototype.connect = function( func )
{
    var self = this;
    amqp.connect(this.hostname, function ( err, conn )
    {
        if(err)
        {
            console.log("RabbitMQ connect error: " + err);
            throw err;
        }

        self.connection = conn;

        if(typeof func === 'function')
        {
            func();
        }
    });
}

/**
 * Creates a channel on the RabbitMQ server.
 * @param {string} Name The channel name.
 */
RabbitMQ.prototype.createChannel = function( name , exch, exch_type, exch_durable)
{    
    return new RabbitMQChannel(this, name, exch, exch_type, exch_durable);
}

/**
 * Creates a Rabbit MQ channel instance.
 * @param {RabbitMQ} rabbitmq The RabbitMQ Server Session Instance.
 * @param {string} name The name of the channel.
 * @param {bool} _durable A value indicating whether the channel is durable.
 */
var RabbitMQChannel = function ( rabbitmq, name, exch, exch_type, exch_durable )
{
    console.log("Start Creating RabbitChannel..");

    _durable = exch_durable || true;

    console.log("createChannel - 1");
    // Setup
    this.parent           = rabbitmq;
    this.name             = name;
    this.exchange         = exch;
    this.exchange_type    = exch_type;
    this.exchange_durable = _durable;
    this.channel_instance = null;

    // API Setup
    var self = this;
    console.log("createChannel - 2");
    this.parent.connection.createChannel( function ( err, channel )
    {
        console.log("createChannel - 3");
        if(err)
        {
            console.log("createChannel - 4");
            throw err;
        }

        console.log("createChannel - 5");
        channel.assertExchange(self.exchange, self.exchange_type, self.exchange_durable);

        console.log("createChannel - 6");
        channel.assertQueue( self.name, self.exchange_durable);

        console.log("createChannel - 7");
        channel.bindQueue(name, exch, '');

        console.log("createChannel - 8");
        channel.prefetch(1);

        console.log("createChannel - 9");

        //self.channel_instance = channel;
        return channel;

    });
}

/**
 * Polls if the channel is available.
 * @return A value indicating whether the channel is available.
 */
RabbitMQChannel.prototype.isAvailable = function()
{
    return this.channel_instance != null;
}

/**
 * Sends a buffer to the queue.
 * @param {Buffer} buffer The buffer.
 * @param {Object} options The options.
 */
RabbitMQChannel.prototype.sendToQueue = function( buffer, options )
{
   // console.log("RabbitMQ - push to queue: " + JSON.parse(buffer.toString()));
   return this.channel_instance.publish(this.exchange, buffer, options);
   //return this.channel_instance.sendToQueue(this.name, buffer, options);
}

/**
 * Consumes a message from the queue.
 * @param {Function} func The function.
 * @param {Object} options The options.
 */
RabbitMQChannel.prototype.consume = function ( func, options )
{
    return this.channel_instance.consume(this.name, func, options);
}

RabbitMQChannel.prototype.ack = function ( obj )
{
    return this.channel_instance.ack(obj);
}


module.exports = RabbitMQ;
