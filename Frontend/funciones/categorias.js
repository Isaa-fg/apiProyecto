const API = "http://localhost:3000";

async function cargarCategorias() {
    try {
        const res = await fetch(`${API}/categorias`);
        const data = await res.json();
        console.log(data);

        const tabla = document.getElementById("tablaCategorias");
        tabla.innerHTML = "";

        data.forEach(Categorias => {
            tabla.innerHTML += `
        <tr>
            <td>${Categorias.id_categoria}</td>
            <td>${Categorias.nombre}</td>
            <td>${Categorias.descripcion}</td>
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

cargarCategorias();