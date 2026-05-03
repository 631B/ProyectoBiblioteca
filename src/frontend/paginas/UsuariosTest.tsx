import { useEffect, useState } from "react";

const API_URL = "http://192.168.0.100:3000";

type Usuario = {
  id: number;
  nombre: string;
  dni: string;
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");

  // 🔄 Load usuarios
  const fetchUsuarios = async () => {
    const res = await fetch(`${API_URL}/usuarios`);
    const data = await res.json();
    setUsuarios(data);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // ➕ CREATE
  const crearUsuario = async () => {
    if (!nombre || !dni) {
      alert("Faltan datos");
      return;
    }

    const res = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, dni }),
    });

    const data = await res.json();

    if (data.success) {
      setNombre("");
      setDni("");
      fetchUsuarios();
    } else {
      alert(data.error);
    }
  };

  // ✏️ EDIT
  const borrarUsuario = async (usuario: Usuario) => {
  if (!confirm("¿Eliminar este usuario?")) return;

  const res = await fetch(`${API_URL}/usuarios/${usuario.id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (data.success) {
    // update UI without refetch
    setUsuarios((prev) => prev.filter((u) => u.id !== usuario.id));
  } else {
    alert(data.error);
  }
};
  
  const editarUsuario = async (usuario: Usuario) => {
    const nuevoNombre = prompt("Nuevo nombre:", usuario.nombre);
    if (nuevoNombre === null) return;

    const nuevoDni = prompt("Nuevo DNI:", usuario.dni);
    if (nuevoDni === null) return;

    const updates: Partial<Usuario> = {};

    if (nuevoNombre !== usuario.nombre) updates.nombre = nuevoNombre;
    if (nuevoDni !== usuario.dni) updates.dni = nuevoDni;

    if (Object.keys(updates).length === 0) return;

    const res = await fetch(`${API_URL}/usuarios/${usuario.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    const data = await res.json();

    if (data.success) {
      fetchUsuarios();
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Usuarios 👤</h1>

      {/* CREATE */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={crearUsuario}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Crear
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {usuarios.map((u) => (
          <div
            key={u.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{u.nombre}</p>
              <p className="text-sm text-gray-500">DNI: {u.dni}</p>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => editarUsuario(u)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                    Editar
                </button>

                <button
                    onClick={() => borrarUsuario(u)}
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