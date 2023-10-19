import { Pool } from "pg";
import { password } from "./password";

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: password,
  database: "postgres",
});

export async function connectDatabase() {
  try {
    const client = await pool.connect();
    console.log("Connected to the database");
    return client;
  } catch (error) {
    console.error(`Error connecting to the database: ${error}`);
    throw error;
  }
}

export async function closeDatabase(client: any) {
  try {
    client.release();
    console.log("Released the database connection");
  } catch (error) {
    console.error(`Error releasing the database connection: ${error}`);
  }
}
