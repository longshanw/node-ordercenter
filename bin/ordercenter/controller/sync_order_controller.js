var http = require('http');
var rabbitmqUtils = require('../utils/rabbitmq_utils');

http.createServer(function (req, res) {
    var jsonData = "";
    req.on('data', function (chunk) {
        jsonData += chunk;
    });
    req.on('end', function () {
        //获取发送mq请求参数
        var mqRequest = getRabbitMqRequest(jsonData);
        //发送消息
        rabbitmqUtils.publishMsg(mqRequest,true,function (sendFlag) {
            var httpResponse = getHttpResponse(sendFlag, '【请求内容】：'+jsonData);
            res.writeHead(httpResponse.code);
            res.end(JSON.stringify(httpResponse));
        });
    });
}).listen(8088);


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

/*

var http = require('http');
var options = {
    host: '127.0.0.1',
    path: '/sync-orders',
    port: '8088',
    method: 'POST'
};
function readJSONResponse(response) {
    var responseData = '';
    response.on('data', function (chunk) {
        responseData += chunk;
    });

    response.on('end', function () {
        var dataObj = JSON.parse(responseData);
        console.log("Raw Response: " +responseData);
        console.log("Message: " + dataObj.message);
        console.log("Question: " + dataObj.question);
    });
}
var req = http.request(options, readJSONResponse);
req.write('{"name":"Bilbo", "occupation":"Burglar"}');
req.end();*/
