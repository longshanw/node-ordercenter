// var rabbitmq = require('../utils/amqplib_utils');
var rabbitmq = require('../utils/amqp_utils');

//接收消息请求测试
var mqRequest = new Object();
mqRequest.url = "amqp://wls:wls@127.0.0.1:5672";
mqRequest.type="topic";
mqRequest.exchange="topic_order_exchange";
mqRequest.routingKey="order.order_detail.key";
mqRequest.queueName="topic_order_detail_sync_queue";
mqRequest.durable=true;
mqRequest.autoDelete=false;
mqRequest.noAck=true;//true：手工回执 false:自动回执
mqRequest.prefetch=5;
/**
 * 如果输入的是false，那与之相连的客户端都断开连接的话，服务是不会删除这个队列的，队列中的消息也就会存在
 * 如果是true，那么申明这个queue的connection断了，那么这个队列就被删除了，包括里面的消息
 * @type {boolean}
 */
mqRequest.exclusive=false;
rabbitmq.receiveMsg(mqRequest);