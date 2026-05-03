
export default function AñadirLibros() {

    const addLibro = async () => {
        const isbn = prompt("ISBN:");
        const titulo = prompt("Título:");
        const autor = prompt("Autor:");
        const editorial = prompt("Editorial");
        const tema = prompt("tema");
        const cantidad = Number(prompt("Cantidad:") || "1");

        if (!titulo || !autor) {
        alert("Falto titulo o autor, libro no subido")
        return;
        }

        const res = await fetch(`${API_URL}/libros`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, autor, isbn, cantidad, editorial, tema }),
        });

        const data = await res.json();

        if (data.success) {
        const updated = await fetch(`${API_URL}/libros`).then((r) => r.json());
        setLibros(updated);
        setFiltered(updated);
        }
    };
}