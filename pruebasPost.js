fetch("http://localhost:3000/prestamos", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"  
    },
    body: JSON.stringify({
        id_libro: "1", 
        id_estudiante: "2", 
        fecha_prestamo: "2026-03-01", 
        fecha_devolucion: "2026-03-15", 
        estado: "devuelto"
    })
}).then(res => res.json()).then(data => console.log(data)); 