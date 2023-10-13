"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
function handleRequest(request, response) {
    var url = request.url;
    var method = request.method;
    console.log("Debugging -- url is", url, "while method is", method);
    response
        // 200 tells the browser the response is successful, memorize the common ones: 200, 401, 403, 404, 500
        // see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
        .writeHead(200)
        .end("You sent me:" + url);
}
var server = http.createServer(handleRequest);
server.listen(3000, function () {
    console.log("Server started at http://localhost:3000");
});
