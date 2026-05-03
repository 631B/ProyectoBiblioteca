import type { Request, Response } from "express";
import e from "express";
import db from "../../dbconnection.ts";

const router = e.Router()

router.patch("/prestamos/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  db.get("SELECT * FROM prestamos WHERE id = ?", [id], (err, row: any) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Prestamo no encontrado" });

    const wasReturned = row.fecha_devolucion !== null;
    const willReturn = req.body.fecha_devolucion !== undefined;

    const allowedFields = ["usuario_id", "libro_id", "fecha_prestamo", "fecha_devolucion"];
    const fields: string[] = [];
    const values: any[] = [];

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(req.body[key]);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No hay campos validos" });
    }

    values.push(id);

    const query = `UPDATE prestamos SET ${fields.join(", ")} WHERE id = ?`;

    db.run(query, values, function (err) {
      if (err) return res.status(500).json({ error: err.message });

      if (!wasReturned && willReturn) {
        db.run(
          "UPDATE libros SET cantidad = cantidad + 1 WHERE id = ?",
          [row.libro_id]
        );
      }

      res.json({ success: true });
    });
  });
});

export default router