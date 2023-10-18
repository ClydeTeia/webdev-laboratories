import { Client } from "pg";
import { password } from "./password";

async function createDatabaseClient() {
  return new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: password,
    database: "postgres",
  });
}

export async function connectDatabase() {
  const client = createDatabaseClient();

  try {
    await (await client).connect();
    console.log("Connected to the database");
    return client;
  } catch (error) {
    console.error(`Error connecting to the database: ${error}`);
    throw error;
  }
}

export async function closeDatabase(client: Client) {
  try {
    await client.end();
    console.log("Closed the database connection");
  } catch (error) {
    console.error(`Error closing the database connection: ${error}`);
  }
}
