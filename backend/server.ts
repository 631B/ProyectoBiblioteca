import express from "express";
import type { Request, Response } from "express";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "database.db");

console.log("DB PATH:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("DB ERROR:", err.message);
  } else {
    console.log("Connected to DB");
  }
});

const app = express();
app.use(express.json());

// CORS
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});


// 📚 GET libros
app.get("/libros", (_req: Request, res: Response) => {
  db.all("SELECT * FROM libros", [], (err, rows) => {
    if (err) {
      console.error("DB ERROR:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }

    res.json(rows);
  });
});

app.post("/libros", (req: Request, res: Response) => {
  const { isbn, titulo, autor, cantidad } = req.body;

  if (!titulo || !autor) {
    res.status(400).json({ error: "Missing data" });
    return;
  }

  db.run(
    `INSERT INTO libros (isbn, titulo, autor, cantidad)
     VALUES (?, ?, ?, ?)`,
    [isbn ?? "", titulo, autor, cantidad ?? 1],
    function (err) {
      if (err) {
        console.error("INSERT ERROR:", err.message);
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({ success: true, id: this.lastID });
    }
  );
});

app.delete("/libros/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  db.run("DELETE FROM libros WHERE id = ?", [id], function (err) {
    if (err) {
      console.error("DELETE ERROR:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({ success: true });
  });
});


// ✏️ UPDATE cantidad
app.put("/libros/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const { cantidad } = req.body;

  db.run(
    "UPDATE libros SET cantidad = ? WHERE id = ?",
    [cantidad, id],
    function (err) {
      if (err) {
        console.error("UPDATE ERROR:", err.message);
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({ success: true });
    }
  );
});


app.listen(3000, "0.0.0.0", () => {
  console.log("✅ Server running LAN");
  console.log("DB PATH:", dbPath);
});