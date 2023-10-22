import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { PASSWORD } from "./password";

const pool = new pg.Pool({
  user: "postgres",
  password: PASSWORD,
  database: "postgres",
});
const port = 3000;

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .post("/patient", async (request, response) => {
      const { name, species, age, sickness } = request.body;
      const date = createDate();

      const query = [name, species, age, sickness, date];

      try {
        const client = connection;
        const queryText = `
          INSERT INTO patient (name, species_name, age, sickness, created_at) VALUES ($1, $2, $3, $4, $5)
        `;
        await client.query(queryText, query);
        client.release();
        response.send("Registration complete");
      } catch (err) {
        console.error("Error:", err);
        response.status(500).send("Registration failed. Please try again.");
      }
    })

    .get("/check-status", async (request, response) => {
      try {
        const { rows: patientData } = await pool.query(`SELECT * FROM patient`);
        console.log(patientData);
        response.json(patientData);
      } catch (err) {
        console.error("ERROR: ", err);
        response
          .status(500)
          .send("Failed to retrieve patient data. Please try again.");
      }
    });

  app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  });
}

function createDate() {
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  const postgresDate = new Date(currentYear, currentMonth, currentDay);

  const formattedDate = postgresDate.toISOString().split("T")[0];

  return formattedDate;
}

startServer();
