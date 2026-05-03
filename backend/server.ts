import express from "express";

//libros
import pedirLibros from "./Routes/Libros/pedirLibros.ts"
import actualizarLibro from "./Routes/Libros/actualizarLibro.ts"
import subirLibro from "./Routes/Libros/subirLibro.ts"
import borrarLibro from "./Routes/Libros/borrarLibro.ts"

//usuarios
import crearUsuario from "./Routes/Usuarios/crearUsuario.ts"
import editarUsuario from "./Routes/Usuarios/editarUsuario.ts"
import pedirUsuarios from "./Routes/Usuarios/pedirUsuarios.ts"
import borrarUsuario from "./Routes/Usuarios/borrarUsuario.ts"

//prestamos
import crearPrestamo from "./Routes/Prestamos/crearPrestamo.ts"
import editarPrestamo from "./Routes/Prestamos/editarPrestamo.ts"
import borrarPrestamo from "./Routes/Prestamos/borrarPrestamo.ts"
import pedirPrestamos from "./Routes/Prestamos/pedirPrestamos.ts"

const app = express();
app.use(express.json());

// CORS
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  next();
});

// Libros
// Pedir libros a la base de datos
app.use("/", pedirLibros)

// Libros Admin //
// actualizar los libros al editarlos
app.use("/", actualizarLibro)
// subir libros nuevos
app.use("/", subirLibro)
// borrar libros
app.use("/", borrarLibro)

// Usuarios //
// Pedir Usuarios a la base de datos
app.use("/", pedirUsuarios)
// Crear Usuario
app.use("/", crearUsuario)
// Editar Usuario
app.use("/", editarUsuario)
// Eliminar Usuario
app.use("/", borrarUsuario)

// Prestamos //
// Pedir Prestamos a la base de datos
app.use("/", pedirPrestamos)
// Crear Prestamo
app.use("/", crearPrestamo)
// Editar Prestamo
app.use("/", editarPrestamo)
// Borrar Prestamo
app.use("/", borrarPrestamo)


app.listen(3000, "0.0.0.0", () => {
  console.log("✅ Server running LAN");
});