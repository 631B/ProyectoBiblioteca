import { useEffect, useState } from "react";

const API_URL = "http://192.168.0.100:3000";

type Prestamo = {
  id: number;
  usuario_id: number;
  libro_id: number;
  fecha_prestamo: string;
  fecha_devolucion: string | null;
};

type Usuario = {
  id: number;
  nombre: string;
};

type Libro = {
  id: number;
  titulo: string;
  cantidad: number;
};

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [libros, setLibros] = useState<Libro[]>([]);

  const [userSearch, setUserSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [selectedBook, setSelectedBook] = useState<Libro | null>(null);

  const [showUsers, setShowUsers] = useState(false);
  const [showBooks, setShowBooks] = useState(false);

  // 🔄 Load
  const fetchAll = async () => {
    const [p, u, l] = await Promise.all([
      fetch(`${API_URL}/prestamos`).then(r => r.json()),
      fetch(`${API_URL}/usuarios`).then(r => r.json()),
      fetch(`${API_URL}/libros`).then(r => r.json())
    ]);

    setPrestamos(p);
    setUsuarios(u);
    setLibros(l);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // 🔎 filters
  const filteredUsers = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredBooks = libros.filter(l =>
    l.titulo.toLowerCase().includes(bookSearch.toLowerCase())
  );

  // ➕ CREATE
  const crearPrestamo = async () => {
    if (!selectedUser || !selectedBook) {
      alert("Selecciona usuario y libro");
      return;
    }

    const res = await fetch(`${API_URL}/prestamos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario_id: selectedUser.id,
        libro_id: selectedBook.id,
      }),
    });

    const data = await res.json();

    if (data.success) {
      fetchAll();

      setUserSearch("");
      setBookSearch("");
      setSelectedUser(null);
      setSelectedBook(null);
    } else {
      alert(data.error);
    }
  };

  // 🔁 RETURN
  const devolverLibro = async (p: Prestamo) => {
    if (p.fecha_devolucion) return;

    await fetch(`${API_URL}/prestamos/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fecha_devolucion: new Date().toISOString(),
      }),
    });

    fetchAll();
  };

  // ❌ DELETE
  const borrarPrestamo = async (id: number) => {
    if (!confirm("Eliminar préstamo?")) return;

    await fetch(`${API_URL}/prestamos/${id}`, {
      method: "DELETE",
    });

    setPrestamos(prev => prev.filter(p => p.id !== id));
  };

  const getUsuario = (id: number) =>
    usuarios.find(u => u.id === id)?.nombre || `User ${id}`;

  const getLibro = (id: number) =>
    libros.find(l => l.id === id)?.titulo || `Libro ${id}`;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Préstamos</h1>

      {/* CREATE */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-bold mb-3">Crear Préstamo</h2>

        <div className="flex gap-4">

          {/* USER */}
          <div className="w-1/2 relative">
            <input
              placeholder="Buscar usuario..."
              value={userSearch}
              onFocus={() => setShowUsers(true)}
              onChange={(e) => {
                setUserSearch(e.target.value);
                setSelectedUser(null);
              }}
              className="border p-2 rounded w-full"
            />

            {showUsers && (
              <div className="absolute bg-white border w-full max-h-40 overflow-auto z-10">
                {filteredUsers.map(u => (
                  <div
                    key={u.id}
                    onMouseDown={() => {  // 🔥 IMPORTANT FIX
                      setSelectedUser(u);
                      setUserSearch(u.nombre);
                      setShowUsers(false);
                    }}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {u.nombre} (ID: {u.id})
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BOOK */}
          <div className="w-1/2 relative">
            <input
              placeholder="Buscar libro..."
              value={bookSearch}
              onFocus={() => setShowBooks(true)}
              onChange={(e) => {
                setBookSearch(e.target.value);
                setSelectedBook(null);
              }}
              className="border p-2 rounded w-full"
            />

            {showBooks && (
              <div className="absolute bg-white border w-full max-h-40 overflow-auto z-10">
                {filteredBooks.map(l => (
                  <div
                    key={l.id}
                    onMouseDown={() => {  // 🔥 IMPORTANT FIX
                      setSelectedBook(l);
                      setBookSearch(l.titulo);
                      setShowBooks(false);
                    }}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {l.titulo} ({l.cantidad})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={crearPrestamo}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Crear préstamo
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {prestamos.map(p => (
          <div
            key={p.id}
            className="bg-white p-4 rounded shadow flex justify-between"
          >
            <div>
              <p><b>{getUsuario(p.usuario_id)}</b></p>
              <p>{getLibro(p.libro_id)}</p>
              <p className="text-sm text-gray-500">{p.fecha_prestamo}</p>
              <p>
                {p.fecha_devolucion ? "Devuelto" : "Prestado"}
              </p>
            </div>

            <div className="flex gap-2">
              {!p.fecha_devolucion && (
                <button
                  onClick={() => devolverLibro(p)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Devolver
                </button>
              )}

              <button
                onClick={() => borrarPrestamo(p.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
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