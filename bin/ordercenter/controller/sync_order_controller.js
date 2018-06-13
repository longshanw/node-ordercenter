var rabbitmqUtils = require('../utils/rabbitmq_utils');

var express = require('express');
var app = express();

app.post('/order/sync-orders', function (req, res) {
    syncorders(req,res,true);
}).listen({ port:8088,host:'127.0.0.1' }/*8088,'127.0.0.1'*/);


/*
// http基本请求
var http = require('http');
http.createServer(function (req, res) {
    // console.log(req.url);
    switch (req.method) {
        case 'POST':
            syncorders(req,res,true);
            break;
        case 'GET':

            break;

        case 'DELETE':

            break;
    }

}).listen({ port:8088,host:'127.0.0.1' }/!*8088,'127.0.0.1'*!/);
*/


/**
 * post请求同步订单
 * @param req
 * @param res
 */
function syncorders(req,res,ackFlag) {
    var jsonData = "";
    req.on('data', function (chunk) {
        jsonData += chunk;
    });
    req.on('end', function () {
        //获取发送mq请求参数
        var mqRequest = getRabbitMqRequest(jsonData);
        //发送消息
        rabbitmqUtils.publishMsg(mqRequest,ackFlag,function (sendFlag) {
            var httpResponse = getHttpResponse(sendFlag, '【请求内容】：'+jsonData);
            res.writeHead(httpResponse.code,{'Content-Type':'application/json;charset=UTF-8'});
            res.end(JSON.stringify(httpResponse));
        });
    });
}

/**
 * 获取发送mq请求参数
 * @param msg
 * @returns {Object}
 */
function getRabbitMqRequest(msg) {
    var mqRequest = new Object();
    mqRequest.url = "amqp://wls:wls@127.0.0.1:5672";
    mqRequest.type = "topic";
    mqRequest.exchange = "topic_order_exchange";
    mqRequest.routingKey = "order.order_detail.key";
    mqRequest.msg = msg;
    return mqRequest;
}

/**
 * 获取返回http结果
 * @param sendFlag
 * @returns {Object}
 */
function getHttpResponse(sendFlag, msg) {
    var httpResponse = new Object();
    if (sendFlag) {
        httpResponse.code = 200;
        httpResponse.msg = '同步订单成功！';
    } else {
        httpResponse.code = 500;
        httpResponse.msg = '同步订单异常！';
    }
    httpResponse.msg = httpResponse.msg + msg;
    return httpResponse;
}

