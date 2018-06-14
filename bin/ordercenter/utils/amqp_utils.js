//改造    wls     2018年6月12日17点05分
var amqp = require('amqp');

var amqpConn = amqp.createConnection({url: "amqp://wls:wls@localhost:5672"});

/**
 * 发送消息
 * @param mqRequest
 * @param ackFlag  true:需要回执   false：不接收回执
 * @param callbackfunction
 */
function publishMsg(mqRequest, ackFlag, callbackfunction) {
    if (amqpConn == undefined) {
        console.log(" [Request]：%s [amqpConn]：%s", JSON.stringify(mqRequest), amqpConn);
        if (ackFlag) {
            callbackfunction(false);
        }
        return;
    }
    amqpConn.on('error', function (e) {
        console.log("Error from amqp: ", e);
    });
    var exchange = amqpConn.exchange(mqRequest.exchange, {
        type: mqRequest.type,
        durable: mqRequest.durable,
        autoDelete: mqRequest.autoDelete,
        confirm: mqRequest.confirm
    }, function (exchange) {
        exchange.publish(mqRequest.routingKey, mqRequest.msg, {mandatory: true, durable: true}, (errFlag) => {
            console.log(" [Request]：%s [Response]：%s ", JSON.stringify(mqRequest), errFlag);  //回调
            exchange.destroy(true);
            callbackfunction(!errFlag);
        });
    });
}


/**
 * 接收消息
 * @param mqRequest
 */
function receiveMsg(mqRequest) {
    amqpConn.on('error', function (e) {
        console.log("Error from amqp: ", e);
    });

    amqpConn.on('ready', function () {
        var exchange = amqpConn.exchange(mqRequest.exchange, {
            type: mqRequest.type,
            durable: mqRequest.durable,
            autoDelete: mqRequest.autoDelete,
            confirm: mqRequest.confirm
        }, (exchange) => {
            exchange.destroy(true);
        });
        var queue = amqpConn.queue('topic_order_detail_sync_queue', {durable: mqRequest.durable, autoDelete: mqRequest.autoDelete}, function (queue) {
            queue.bind('topic_order_exchange', 'order.order_detail.key', (queue) => {
                // console.log(queue);
            });
            queue.subscribe({
                ack: mqRequest.noAck,
                prefetchCount: mqRequest.prefetch,
                exclusive: mqRequest.exclusive
            }, function (message, header, deliveryInfo, messageObject) {
                console.log("[receive msg]: %s", message.data.toString());
                messageObject.acknowledge(true); // use true if you want to acknowledge all previous messages of the queue
                // queue.shift(false);//回执消息
            });
        });
    });

}


module.exports.publishMsg = publishMsg;
module.exports.receiveMsg = receiveMsg;