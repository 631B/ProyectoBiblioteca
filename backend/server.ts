import express from "express";
import getBooks from "./Routes/getBooks"
import updateBooks from "./Routes/updateBooks"
import uploadBooks from "./Routes/uploadBooks"
import deleteBooks from "./Routes/deleteBooks"

const app = express();
app.use(express.json());

// CORS
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});

// Pedir libros a la base de datos
app.use("/", getBooks)

// actualizar los libros al editarlos
app.use("/", updateBooks)

// subir libros nuevos
app.use("./", uploadBooks)

// borrar libros
app.use("./", deleteBooks)

app.listen(3000, "0.0.0.0", () => {
  console.log("✅ Server running LAN");
});