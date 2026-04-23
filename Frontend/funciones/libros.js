const API = "http://localhost:3000";

async function cargarLibros() {
    try {
        const res = await fetch(`${API}/libros`);
        const data = await res.json();
        console.log(data);

        const tabla = document.getElementById("tablaLibros");
        tabla.innerHTML = "";

        data.forEach(Libros => {
            tabla.innerHTML += `
        <tr>
            <td>${Libros.id_libro}</td>
            <td>${Libros.titulo}</td>
            <td>${Libros.nombre_autor}</td>
            <td>${Libros.nombre_categoria}</td>
            <td>${Libros.anio_publicacion}</td>
            <td>${Libros.numero_identificacion}</td>
            <td>${Libros.cantidad}</td>
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

cargarLibros();