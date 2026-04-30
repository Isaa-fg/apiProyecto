const API = "http://localhost:3000";
const timestamp = 1714483200; 
const date = new Date(timestamp * 1000); 

async function cargarEstudiantes() {
    try {
        const res = await fetch(`${API}/estudiantes`);
        const data = await res.json();
        console.log("ESTUDIANTES:");
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
            <td>${date.toISOString(Estudiantes.fecha_registro).split('T')[0]}</td>
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