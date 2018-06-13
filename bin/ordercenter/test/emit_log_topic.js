#!/usr/bin/env node

/*var amqp = require('amqplib/callback_api');

amqp.connect('amqp://wls:wls@127.0.0.1:5672', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var ex = 'topic_logs';
        var args = process.argv.slice(2);
        var key = (args.length > 0) ? args[0] : 'anonymous.info';
        var msg = args.slice(1).join(' ') || 'Hello World!';

        ch.assertExchange(ex, 'topic', {durable: true});
        ch.publish(ex, key, new Buffer(msg));
        console.log(" [x] Sent %s: '%s'", key, msg);
    });

    setTimeout(function() { conn.close(); process.exit(0) }, 500);
});*/

//改造    wls     2018年6月12日17点05分
var rabbitmq = require('../utils/rabbitmq_utils');

var mqRequest = new Object();
mqRequest.url = "amqp://wls:wls@127.0.0.1:5672";
mqRequest.type="topic";
mqRequest.exchange="topic_logs_exchange";
mqRequest.routingKey="ordercenter.synorders.logs";
mqRequest.msg="ack";
var flag = rabbitmq.publishMsg(mqRequest);
console.log('结束----------------'+flag);
