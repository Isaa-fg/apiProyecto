const API = "http://localhost:3000";
const timestamp = 1714483200; 
const date = new Date(timestamp * 1000); 

async function cargarAutores() {
    try {
        const res = await fetch(`${API}/autores`);
        const data = await res.json();
        console.log(data);

        const tabla = document.getElementById("tablaAutores");
        tabla.innerHTML = "";

        data.forEach(Autores => {
            tabla.innerHTML += `
        <tr>
            <td>${Autores.id_autor}</td>
            <td>${Autores.nombre}</td>
            <td>${Autores.nacionalidad}</td>
            <td>${date.toISOString(Autores.fecha_nacimiento).split('T')[0]}</td>
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

cargarAutores();