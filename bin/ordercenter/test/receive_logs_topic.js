#!/usr/bin/env node

/*var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

if (args.length == 0) {
    console.log("Usage: receive_logs_topic.js <facility>.<severity>");
    process.exit(1);
}

amqp.connect('amqp://wls:wls@127.0.0.1:5672', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var ex = 'topic_logs';
        ch.assertExchange(ex, 'topic', {durable: true});

        ch.assertQueue('', {exclusive: true}, function(err, q) {
            console.log(' [*] Waiting for logs. To exit press CTRL+C');

            args.forEach(function(key) {
                ch.bindQueue(q.queue, ex, key);
            });

            ch.consume(q.queue, function(msg) {
                console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
            }, {noAck: true});
        });
    });
});*/




var rabbitmq = require('../utils/rabbitmq_utils');

//接收消息请求测试
var mqRequest = new Object();
mqRequest.url = "amqp://wls:wls@127.0.0.1:5672";
mqRequest.type="topic";
mqRequest.exchange="topic_logs_exchange";
mqRequest.routingKey="ordercenter.synorders.logs";
mqRequest.queueName="topic_logs_queue";
mqRequest.prefetch=3;
mqRequest.durable=true;
mqRequest.noAck=false;
/**
 * 如果输入的是false，那与之相连的客户端都断开连接的话，服务是不会删除这个队列的，队列中的消息也就会存在
 * 如果是true，那么申明这个queue的connection断了，那么这个队列就被删除了，包括里面的消息
 * @type {boolean}
 */
mqRequest.exclusive=false;
rabbitmq.receiveMsg(mqRequest);