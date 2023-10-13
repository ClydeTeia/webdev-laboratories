import * as http from "node:http";
import { IncomingMessage, ServerResponse } from "node:http";
import * as fs from "node:fs/promises";
import { Pool } from "pg";

async function handleRequest(
  request: IncomingMessage,
  response: ServerResponse
) {
  const url = request.url;
  const method = request.method;

  console.log("Debugging -- url is", url, "while method is", method);

  if (url === "/apply-loan") {
    try {
      const contents = await fs.readFile(
        "./lending-form.html"
      ); /* how to read file contents again? */
      response
        .writeHead(200, { "Content-Type": "text/html" }) // tell the browser that you're sending HTML
        .end(contents.toString());
    } catch (error) {
      response.writeHead(500, { "Content-Type": "text/plain" });
      response.end("Internal Server Error");
    }
  } else if (url === "/apply-loan-success") {
    
    try {
      let body = ''

      request.on('data', (chunk) => {
        body += chunk.toString();
      })
    }

  } else {
    response
      // 200 tells the browser the response is successful, memorize the common ones: 200, 401, 403, 404, 500
      // see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      .writeHead(200)
      .end("You sent me:" + url);
  }
}

const server = http.createServer(handleRequest);

server.listen(3000, () => {
  console.log("Server started at http://localhost:3000");
});
