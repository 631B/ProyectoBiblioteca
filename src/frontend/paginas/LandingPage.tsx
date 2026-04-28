import { useEffect, useState } from "react";

const API_URL = "http://192.168.150.158:3000"

type Libro = {
  id: number;
  isbn: string;
  titulo: string;
  autor: string;
  cantidad: number;
};

export default function LandingPage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [filtered, setFiltered] = useState<Libro[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("titulo");

  useEffect(() => {
    fetch(`${API_URL}/libros`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLibros(data);
          setFiltered(data);
        } else {
          console.error("API ERROR:", data);
        }
      });
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();

    const result = libros.filter((libro) => {
      if (filterType === "isbn") return libro.isbn?.toLowerCase().includes(term);
      if (filterType === "autor") return libro.autor?.toLowerCase().includes(term);
      return libro.titulo?.toLowerCase().includes(term);
    });

    setFiltered(result);
  }, [search, filterType, libros]);

  // ➕ ADD
  const addLibro = async () => {
    const titulo = prompt("Título:");
    const autor = prompt("Autor:");
    const isbn = prompt("ISBN:");
    const cantidad = Number(prompt("Cantidad:") || "1");

    if (!titulo || !autor) return;

    const res = await fetch(`${API_URL}/libros`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, autor, isbn, cantidad }),
    });

    const data = await res.json();

    if (data.success) {
      const updated = await fetch(`${API_URL}/libros`).then((r) => r.json());
      setLibros(updated);
      setFiltered(updated);
    }
  };

  // ❌ DELETE
  const deleteLibro = async (id: number) => {
    if (!confirm("Delete this book?")) return;

    await fetch(`${API_URL}/libros/${id}`, {
      method: "DELETE",
    });

    setLibros((prev) => prev.filter((l) => l.id !== id));
    setFiltered((prev) => prev.filter((l) => l.id !== id));
  };

  // ✏️ UPDATE
  const updateCantidad = async (id: number, cantidad: number) => {
    await fetch(`${API_URL}/libros/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidad }),
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Biblioteca 📚</h1>

      {/* ADD BUTTON */}
      <button
        onClick={addLibro}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        + Agregar libro
      </button>

      {/* FILTER */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="titulo">Título</option>
          <option value="autor">Autor</option>
          <option value="isbn">ISBN</option>
        </select>
      </div>

      <p className="mb-4 text-gray-600">
        Mostrando {filtered.length} libros
      </p>

      {/* LIST */}
      <div className="space-y-3">
        {filtered.map((libro) => (
          <div
            key={libro.id}
            className="flex justify-between items-center bg-white p-4 rounded shadow"
          >
            <div>
              <p className="font-semibold">{libro.titulo}</p>
              <p className="text-sm text-gray-500">{libro.autor}</p>
              <p className="text-xs text-gray-400">ISBN: {libro.isbn}</p>
            </div>

            <div className="flex items-center gap-3">
              {/* EDIT */}
              <input
                type="number"
                value={libro.cantidad ?? 0}
                onChange={(e) => {
                  const val = Number(e.target.value);

                  setFiltered((prev) =>
                    prev.map((l) =>
                      l.id === libro.id ? { ...l, cantidad: val } : l
                    )
                  );

                  setLibros((prev) =>
                    prev.map((l) =>
                      l.id === libro.id ? { ...l, cantidad: val } : l
                    )
                  );
                }}
                onBlur={(e) =>
                  updateCantidad(libro.id, Number(e.target.value))
                }
                className="w-20 border rounded p-1 text-center"
              />

              {/* DELETE ✅ NOW WORKS */}
              <button
                onClick={() => deleteLibro(libro.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}