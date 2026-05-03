import e from "express";
import db from "../../dbconnection.ts";
import type { Request, Response } from "express";

const router = e.Router()

router.delete("/prestamos/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  db.get(
    "SELECT libro_id, fecha_devolucion FROM prestamos WHERE id = ?",
    [id],
    (err, row: any) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Prestamo no encontrado" });

      const { libro_id, fecha_devolucion } = row;

      db.run("DELETE FROM prestamos WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        if (!fecha_devolucion) {
          db.run(
            "UPDATE libros SET cantidad = cantidad + 1 WHERE id = ?",
            [libro_id]
          );
        }

        res.json({ success: true });
      });
    }
  );
});

export default router