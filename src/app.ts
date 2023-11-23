import express from "express";
import { collection } from "./db";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("API for labor market analysis");
});

app.get("/api/vacancies", async (req, res) => {
  try {
    const vacancies = await collection.find({}).toArray();
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(vacancies, null, 4));
  } catch (error) {
    console.error("Error fetching vacancies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
