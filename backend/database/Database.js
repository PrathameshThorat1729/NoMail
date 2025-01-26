import {createConnection} from "mysql2/promise";

export const connection = await createConnection({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "NoMail"
});