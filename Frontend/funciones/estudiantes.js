const API = "http://localhost:3000";

async function cargarEstudiantes() {
    try {
        const res = await fetch(`${API}/estudiantes`);
        const data = await res.json();
        console.log(data);

        const tabla = document.getElementById("tablaEstudiantes");
        tabla.innerHTML = "";

        data.forEach(Estudiantes => {
            tabla.innerHTML += `
        <tr>
            <td>${Estudiantes.id_estudiante}</td>
            <td>${Estudiantes.nombre}</td>
            <td>${Estudiantes.apellido}</td>
            <td>${Estudiantes.carrera}</td>
            <td>${Estudiantes.email}</td>
            <td>${Estudiantes.telefono}</td>
            <td>${Estudiantes.fecha_nacimiento}</td>
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

cargarEstudiantes();