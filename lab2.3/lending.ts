import * as http from "node:http";
import * as fs from "node:fs/promises";
import * as querystring from "querystring";
import { generateUniqueToken } from "./generateUniqueToken";
import { connectDatabase, closeDatabase } from "./database";
import displayLoanDetails from "./displayLoanDetails";

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
  } else if (url === "/apply-loan-success") {
    let body: string = "";

    request.on("data", (chunk) => {
      body += chunk.toString();
    });

    request.on("end", async () => {
      try {
        const loanFormData = querystring.parse(body.toString());
        const { name, email, phone, reason, amount } = loanFormData;
        const uniqueToken = generateUniqueToken;
        console.log(uniqueToken, "at success");

        const date = new Date().toLocaleString();

        const insertQuery = `
            INSERT INTO loans (name, email, phone_number, loan_reason, loan_amount, unique_token, approval_or_rejection_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `;

        const values = [
          name,
          email,
          phone,
          reason,
          Number(amount),
          uniqueToken,
          date,
        ];

        const client = connectDatabase();

        try {
          await (await client).query(insertQuery, values);

          response
            .writeHead(200, { "Content-Type": "text/html" })
            // display the clients details
            .end(displayLoanDetails(values));
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
  } else if (url === "/loan-details" && method === "POST") {
    console.log("Test at loan-details on==main");

    let body: string = "";

    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", async () => {
      try {
        const tokenData = querystring.parse(body);
        const { unique_token } = tokenData;

        const client = await connectDatabase();

        const selectQuery = `
        SELECT * FROM loans
        WHERE unique_token = $1
        `;

        const result = await client.query(selectQuery, [unique_token]);

        const rows = result.rows;

        client.release();

        console.log(rows);
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    });
  } else {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("Not Found hi");
  }
}

server.listen(port, () => {
  console.log("Server started at http://localhost:3000");
});
