import sqlite3 from "sqlite3";

const dbPath = "./database.db"

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("DB ERROR:", err.message);
  } else {
    console.log("Connected to DB");
  }
});

export default db