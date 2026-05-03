import e from "express";
import db from "../dbconnection";
import type { Request, Response } from "express";

const router = e.Router()

router.delete("/libros/:id", (req: Request, res: Response) => {
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

export default router