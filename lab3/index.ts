import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { PASSWORD } from "./backend/password";
import { createDate } from "./backend/createDate";

const pool = new pg.Pool({
  user: "postgres",
  password: PASSWORD,
  database: "postgres",
});
const port = 3000;

async function startServer() {
  const connection = await pool.connect();

  const app = express();

  app.set("view engine", "ejs");

  app.use(express.static("./frontend"));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(logger);

  app.get("/", (request, response) => {
    response.sendFile("index", { root: __dirname });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.post("/patient", async (request, response) => {
    const { name, species, age, sickness } = request.body;
    const created_date = createDate();

    const query = [name, species, age, sickness, created_date];

    try {
      const queryText = `
          INSERT INTO patient (name, species_name, age, sickness, created_at) VALUES ($1, $2, $3, $4, $5)
        `;
      await connection.query(queryText, query);
      response.send("Registration complete");
    } catch (err) {
      console.error("Error:", err);
      response.status(500).send("Registration failed. Please try again.");
    }
  });

  app.post("/edit-patient", async (request: Request, response: Response) => {
    const { id } = request.body;
    console.log("redirect patient params success");
    response.redirect(`patient/${id}`);
  });

  app.get("/patient/:id", async (request, response) => {
    const { id } = request.params;
    const query = [id];

    try {
      const queryText = `
          SELECT * FROM patient
          WHERE patient_id = $1
        `;

      const { rows: patient } = await connection.query(queryText, query);
      console.log(patient[0], "patient data");
      const patientData = patient[0];
      console.log("patient params success");

      response.render("edit-patient", { patientData });
    } catch (err) {
      console.error("Error:", err);
      response.status(500).send("Update failed. Please try again.");
    }
  });

  app.put("/patient/:id", async (request, response) => {
    const { id } = request.params;
    const { name, species, age, sickness } = request.body;
    const date = createDate();

    try {
      const queryText = `
        UPDATE patient
        SET name = $1, species_name = $2, age = $3, sickness = $4, updated_at = $5 WHERE patient_id = $6 RETURNING *
      `;

      const value = [name, species, age, sickness, date, id];
      const result = await connection.query(queryText, value);
      console.log("put at patients query");

      if (result.rows.length > 0) {
        const updatedPatient = result.rows[0];
        response.json(updatedPatient);
        console.log("put at patients and convert to json");
      } else {
        response.status(404).send("Patient not found.");
      }
    } catch (err) {
      console.error("Error:", err);
      response
        .status(500)
        .send("Error updating patient data. Please try again.");
    }
  });

  app.get("/check-status", async (request, response) => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function logger(req: { originalUrl: any }, res: any, next: () => void) {
  console.log(req.originalUrl, "logger");
  next();
}

startServer();
