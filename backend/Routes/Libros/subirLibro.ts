import e from "express";
import type { Request, Response } from "express";
import db from "../../dbconnection.ts";

const router = e.Router()

router.post("/libros", (req: Request, res: Response) => {
  const { isbn, titulo, autor, cantidad, editorial, tema } = req.body;

  if (!titulo || !autor) {
    res.status(400).json({ error: "Missing data" });
    return;
  }

  db.run(
    `INSERT INTO libros (isbn, titulo, autor, editorial, tema, cantidad)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [isbn ?? "", titulo, autor, editorial, tema, cantidad ?? 1],
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

export default router