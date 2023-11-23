import { MongoClient, Db } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const client: MongoClient = new MongoClient(
  `mongodb://${process.env.USERNM}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}/`,
);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

export const db: Db = client.db("labor_market");
export const collection = db.collection("data");
