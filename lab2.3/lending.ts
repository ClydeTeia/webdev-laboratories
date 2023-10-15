import * as http from "node:http";
import * as fs from "node:fs/promises";
import * as querystring from "querystring";
import { connectDatabase, closeDatabase } from "./database";

const server = http.createServer(handleRequest);
const port = 3000;

async function handleRequest(
  request: http.IncomingMessage,
  response: http.ServerResponse
) {
  const url = request.url;
  const method = request.method;

  if (url === "/apply-loan") {
    try {
      const contents = await fs.readFile("./lending-form.html");
      response
        .writeHead(200, { "Content-Type": "text/html" })
        .end(contents.toString());
    } catch (error) {
      console.error(`Error serving the form: ${error}`);
      response.writeHead(500, { "Content-Type": "text/plain" });
      response.end("Internal Server Error at apply-loan");
    }
  } else if (url === "/apply-loan-success" && method === "POST") {
    try {
      let body = "";

      request.on("data", (chunk) => {
        body += chunk.toString();
      });

      request.on("end", async () => {
        try {
          const loanFormData = querystring.parse(body.toString());
          const { name, email, phone_number, reason, amount } = loanFormData;

          const insertQuery = `
            INSERT INTO loans (name, email, phone_number, loan_reason, loan_amount)
            VALUES ($1, $2, $3, $4, $5)
          `;

          const values = [name, email, phone_number, reason, Number(amount)];

          const client = connectDatabase();

          try {
            await (await client).query(insertQuery, values);

            response.writeHead(200, { "Content-Type": "text/plain" });
            response.end("Loan application submitted successfully");
          } catch (error) {
            console.error(`Error inserting data into the database: ${error}`);
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.end("Internal Server Error at query");
          } finally {
            closeDatabase(await client);
          }
        } catch (error) {
          console.error(
            `Error processing the form data or inserting into the database: ${error}`
          );
          response.writeHead(500, { "Content-Type": "text/plain" });
          response.end("Internal Server Error 67");
        }
      });
    } catch (error) {
      console.error(`Error: ${error}`);
      response.writeHead(500, { "Content-Type": "text/plain" });
      response.end("Internal Server Error 73");
    }
  } else {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("Not Found hi");
  }
}

server.listen(port, () => {
  console.log("Server started at http://localhost:3000");
});
