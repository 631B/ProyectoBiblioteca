import express from "express";
import type { Request, Response, NextFunction } from "express";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import path from "path";

sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, "library.db");
const db = new sqlite3.Database(dbPath);

const app = express();
app.use(express.json());

// CORS
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// GET books
app.get("/books", (_req: Request, res: Response) => {
  db.all("SELECT * FROM books LIMIT 10000", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});