import e from "express";
import db from "../../dbconnection.ts";
import type { Request, Response } from "express";

const router = e.Router()

router.post("/prestamos", (req: Request, res: Response) => {
    const { usuario_id, libro_id } = req.body;

    if (!usuario_id || !libro_id) {
        res.status(400).json({ error: "Missing data" });
        return;
    }

    db.run( 
        `INSERT INTO prestamos (usuario_id, libro_id, fecha_prestamo)
        VALUES (?, ?, CURRENT_TIMESTAMP)`,
        [usuario_id, libro_id],
        function (err) {
            if (err) {
                console.error("INSERT ERROR:", err.message);
                res.status(500).json({ error: err.message });
                return;
            }

            db.run(
                "UPDATE libros SET cantidad = cantidad - 1 WHERE id = ?",
                [libro_id]
            );

            res.json({ success: true, id: this.lastID });
        }
    );
});

export default router