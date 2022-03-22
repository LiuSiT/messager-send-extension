const http = require('http');

/**
 * http模块发送请求
 * @param host
 * @param port
 * @param route
 * @param headers
 * @param encoding 可选值： utf8 binary
 */
function sendHttpRequest(host, port, route, headers = {}, encoding = 'utf8') {
    let options = {
        hostname: host,
        port: port,
        path: '/' + route,
        method: 'GET',
        headers: headers
    };

    let data = '';
    return new Promise(function (resolve, reject) {
        let req = http.request(options, function(res) {
            res.setEncoding(encoding);
            res.on('data', function(chunk) {
                data += chunk;
            });

            res.on('end', function() {
                resolve({result: true, data: data});
            });
        });

        req.on('error', (e) => {
            resolve({result: false, errmsg: e.message});
        });
        req.end();
    });
}

module.exports = {
    sendHttpRequest
}