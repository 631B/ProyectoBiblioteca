import type { Request, Response } from "express";
import e from "express";
import db from "../../dbconnection.ts";

const router = e.Router()

router.patch("/libros/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const allowedFields = ["isbn", "titulo", "autor", "editorial", "tema", "cantidad"];

  const fields: string[] = [];
  const values: any[] = [];

  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = ?`)
      values.push(req.body[key])
    }
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No hay campos validos para actualizar" })
  }

  values.push(id)

  const query = `UPDATE libros SET ${fields.join(", ")} WHERE id = ?`

  db.run(query, values, function(err) {
    if (err) {
      console.error("Error al actualizar:", err.message);
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    res.json({ success: true });
  })
});

export default router