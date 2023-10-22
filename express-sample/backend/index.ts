import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { PASSWORD } from "./password";

const pool = new pg.Pool({
  user: "postgres",
  password: PASSWORD,
  database: "postgres",
});

async function startServer() {
  const connection = await pool.connect();

  const app = express();
  app
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(express.static("../frontend"))

    .get("/", (request, response) => {
      response.sendFile("frontend/index.html", { root: __dirname });
    })

    .get("/hello/:language", (request, response) => {
      const language = request.params.language;
      const greetings = new Map();
      greetings
        .set("en", "hello")
        .set("fr", "bonjour")
        .set("kr", "anyeong")
        .set("jp", "omae mo shindeiru");

      response.json({
        greeting: greetings.get(language) ?? "hello",
        friend: request.query.friend,
      });
    })
    .get("/loans", async (request, response) => {
      const { rows: loans } = await connection.query("SELECT * FROM loans");
      console.log("Retrieved loans", loans);
      response.json(loans);
    })
    .listen(3000, () => {
      console.log("Server has started at http://localhost:3000");
    });
}

startServer();
