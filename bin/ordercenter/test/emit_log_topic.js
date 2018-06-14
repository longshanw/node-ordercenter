#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

/*amqp.connect('amqp://wls:wls@127.0.0.1:5672', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var ex = 'topic_logs_exchange';
        var key = 'ordercenter.synorders.logs';
        var msg = 'Hello World!';

        ch.assertExchange(ex, 'topic', {durable: true});
        ch.publish(ex, key, new Buffer(msg));
        console.log(" [x] Sent %s: '%s'", key, msg);
    });

    setTimeout(function() { conn.close(); process.exit(0) }, 500);
});*/

//改造    wls     2018年6月12日17点05分
var rabbitmq = require('../utils/amqp_utils');

var mqRequest = new Object();
mqRequest.url = "amqp://wls:wls@127.0.0.1:5672";
mqRequest.type="topic";
mqRequest.exchange="topic_logs_exchange";
mqRequest.durable=true;
mqRequest.routingKey="ordercenter.synorders.logs";
mqRequest.msg="hello";
var flag = rabbitmq.publishMsg(mqRequest,false);
console.log('结束----------------'+flag);
