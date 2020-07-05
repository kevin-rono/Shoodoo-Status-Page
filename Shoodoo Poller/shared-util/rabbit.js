var amqp = require('amqplib/callback_api');

// if the connection is closed or fails to be established at all, we will reconnect
var amqpConn        = null;
var pubChannel      = null;
var exch            = "shoodoo_msg_exch";
var exch_type       = "fanout";
var _durable        = "{durable: true}";
var routingKey      = "";
var offlinePubQueue = [];

function start() {
    console.log("# 1");
    //amqp.connect(process.env.CLOUDAMQP_URL + "?heartbeat=60", function(err, conn) {
    amqp.connect("amqp://localhost", function(err, conn) {
        console.log("# 2");
        if (err) {
            console.log("# 3");
            console.error("[AMQP]", err.message);
            return setTimeout(start, 1000);
        }
        conn.on("error", function(err) {
            console.log("# 4");
            if (err.message !== "Connection closing") {
                console.log("# 5");
                console.error("[AMQP] conn error", err.message);
            }
        });
        conn.on("close", function() {
            console.log("# 6");
            console.error("[AMQP] reconnecting");
            return setTimeout(start, 1000);
        });
        console.log("# 7");
        console.log("[AMQP] connected");
        amqpConn = conn;

        whenConnected();
    });
}

function publishMessage(msg) {
    publish( exch, routingKey, new Buffer(msg));
}


function whenConnected() {
    console.log("# 8");
    startPublisher();
    startWorker();
}


function startPublisher() {
    console.log("# 9");
    amqpConn.createConfirmChannel(function(err, ch) {
        console.log("# 10");
        if (closeOnErr(err)) return;
        ch.on("error", function(err) {
            console.log("# 11");
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function() {
            console.log("# 12");
            console.log("[AMQP] channel closed");
        });

        pubChannel = ch;
        console.log("# 13");
        publish(exch, "", new Buffer("my message.."));
    });
}

function publish(exchange, routingKey, content) {
    try {
        console.log("Start Publish - # 14");
        pubChannel.publish(exchange, routingKey, content, { persistent: true },
            function(err, ok) {
                console.log("# 15");
                if (err) {
                    console.log("# 16");
                    console.error("[AMQP] publish", err);
                    //offlinePubQueue.push([exchange, routingKey, content]);
                    pubChannel.connection.close();
                }
                console.log("# 17");
            });
        console.log("End Publish");
    } catch (e) {
        console.error("[AMQP] publish", e.message);
    }
}
// A worker that acks messages only if processed succesfully
function startWorker() {
    console.log("# 18");
    console.log("Worker is started");
    amqpConn.createChannel(function(err, ch) {
        console.log("# 19");
        if (closeOnErr(err)) return;
        ch.on("error", function(err) {
            console.log("# 20");
            console.error("[AMQP] channel error", err.message);
        });

        ch.on("close", function() {
            console.log("# 21");
            console.log("[AMQP] channel closed");
        });

        ch.prefetch(10);
        console.log("# 22");
        ch.assertQueue("jobs", { durable: true }, function(err, _ok) {
            console.log("# 23");
            if (closeOnErr(err)) return;
            ch.consume("jobs", processMsg, { noAck: false });
            console.log("# 24");

        });

        function processMsg(msg) {
            console.log("# 25");
            work(msg, function(ok) {
                console.log("# 26");
                try {
                    if (ok) {
                        console.log("# 27");
                        ch.ack(msg);
                    }
                    else {
                        console.log("# 28");
                        ch.reject(msg, true);
                    }
                } catch (e) {
                    closeOnErr(e);
                }
            });
        }
    });
}

function work(msg, cb) {
    console.log("Got msg ", msg.content.toString());
    cb(true);
}

function closeOnErr(err) {
    console.log("# 29");
    if (!err)
        return false;
    console.error("[AMQP] error", err);
    amqpConn.close();
    console.log("# 30");
    return true;
}

setInterval(function() {
    console.log("# 31");
    publishMessage("message 1111111111");
}, 1000);

/*setInterval(function() {
    publish("", "jobs", new Buffer("work work work"));
}, 1000);
*/

start();

/*
console.log("# 28");
//publishMessage("message 2222222222");

console.log("# 29");
//publishMessage("message 3333333333");

console.log("# 30");
*/
