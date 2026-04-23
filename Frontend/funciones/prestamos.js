const API = "http://localhost:3000";

async function cargarPrestamos() {
    try {
        const res = await fetch(`${API}/prestamos`);
        const data = await res.json();
        console.log(data);

        const tabla = document.getElementById("tablaPrestamos");
        tabla.innerHTML = "";

        data.forEach(Prestamos => {
            tabla.innerHTML += `
        <tr>
            <td>${Prestamos.id_prestamo}</td>
            <td>${Prestamos.id_libro}</td>
            <td>${Prestamos.id_estudiante}</td>
            <td>${Prestamos.fecha_prestamo}</td>
            <td>${Prestamos.fecha_devolucion}</td>
            <td>${Prestamos.estado}</td>
            <td>
                <button class="btn btn-warning btn-sm">Eliminar</button>
            <td/>
        </tr>
        `;
        });
    } catch (error) {
        console.log(error);
    }



}

cargarPrestamos();