import e from "express";
import db from "../../dbconnection.ts";
import type { Request, Response } from "express";

const router = e.Router()

router.post("/usuarios", (req: Request, res: Response) => {
  const { nombre, dni } = req.body;

  if (!nombre || !dni) {
    res.status(400).json({ error: "Missing data" });
    return;
  }

  db.run(
    `INSERT INTO usuarios (nombre, dni)
     VALUES (?, ?)`,
    [nombre, dni],
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