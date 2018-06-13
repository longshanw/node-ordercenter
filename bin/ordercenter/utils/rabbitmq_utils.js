//改造    wls     2018年6月12日17点05分
var amqp = require('amqplib/callback_api');

/**
 * 发送消息
 * @param mqRequest
 * @param ackFlag  true:需要回执   false：不接收回执
 * @param callbackfunction
 */
function publishMsg(mqRequest,ackFlag,callbackfunction) {
    amqp.connect(mqRequest.url, function (err, conn) {
        if (conn == undefined) {
            console.log(" [Request]：%s [Response]：%s", JSON.stringify(mqRequest), "socket timeout!!!");
            if(ackFlag){
                callbackfunction(false);
            }
            return;
        }
        conn.createChannel(function (err, ch) {
            try {
                ch.assertExchange(mqRequest.exchange, mqRequest.type, {durable: mqRequest.durable});
                var sendFlag = ch.publish(mqRequest.exchange, mqRequest.routingKey, new Buffer(mqRequest.msg));
                console.log(" [Request]：%s [Response]：%s", JSON.stringify(mqRequest), sendFlag);
                ch.close(function() { conn.close(); });
            } catch (e) {
                console.error(e);
            } finally {
                if(ackFlag){
                    callbackfunction(sendFlag);
                }
            }
        });
        // setTimeout(function() { conn.close(); /!*process.exit(0)*!/ }, 500);
    });
}


/**
 * 接收消息
 * @param mqRequest
 */
function receiveMsg(mqRequest) {
    amqp.connect(mqRequest.url, function(err, conn) {
        conn.createChannel(function(err, ch) {

                var ex = mqRequest.exchange;
                ch.assertExchange(ex, mqRequest.type, {durable: mqRequest.durable});
                ch.prefetch(mqRequest.prefetch);
                /**
                 * exclusive：
                 * 如果输入的是false，那与之相连的客户端都断开连接的话，服务是不会删除这个队列的，队列中的消息也就会存在
                 * 如果是true，那么申明这个queue的connection断了，那么这个队列就被删除了，包括里面的消息
                 * @type {boolean}
                 */
                ch.assertQueue(mqRequest.queueName, {exclusive: mqRequest.exclusive}, function (err, q) {
                    console.log(' [*] Waiting for logs. To exit press CTRL+C');

                    ch.bindQueue(q.queue, ex, mqRequest.routingKey);

                    ch.consume(q.queue, function (msg) {
                            var body = msg.content.toString();
                            console.log(" [x] %s:'%s'", msg.fields.routingKey, body);
                            if (body == 'nack') {//设置手工回执后，此处需要判断是否需要回执，消息重回队列
                                /**
                                 * message： 发送回执消息
                                 * allUpTo： true新消息拒绝接收，堆积在队列中  false:不拒绝接收新消息
                                 * requeue:  true未回执消息重回队列      false:丢弃或者丢置死信队列
                                 */
                                ch.nack(msg, false, true);
                                ch.close();
                            } else {
                                ch.ack(msg);
                            }
                    }, {noAck: mqRequest.noAck});
                });

        });
    });
}


module.exports.publishMsg = publishMsg;
module.exports.receiveMsg = receiveMsg;