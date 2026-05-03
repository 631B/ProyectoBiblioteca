import type { Request, Response } from "express";
import e from "express";
import db from "../../dbconnection.ts";

const router = e.Router()

router.get("/prestamos", (_req: Request, res: Response) => {
  db.all("SELECT * FROM prestamos", [], (err, rows) => {
    if (err) {
      console.error("DB ERROR:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }

    res.json(rows);
  });
});

export default router;