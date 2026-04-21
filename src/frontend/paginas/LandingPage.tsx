import { useEffect, useState } from "react";

type Book = {
  id: number;
  ISBN: string;
  Titulo: string;
  Autor: string;
  Editorial: string;
  Tema: string;
  Fecha: number;
  Cantidad: number;
};

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Library Books 📚</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white p-4 rounded-xl shadow-md"
          >
            <h2 className="text-lg font-semibold">{book.Titulo}</h2>
            <p className="text-sm text-gray-600">{book.Autor}</p>
            <p className="text-sm">ISBN: {book.ISBN}</p>
            <p className="text-sm">Tema: {book.Tema}</p>
            <p className="text-sm">Año: {book.Fecha}</p>
            <p className="text-sm">Stock: {book.Cantidad}</p>
          </div>
        ))}
      </div>
    </div>
  );
}