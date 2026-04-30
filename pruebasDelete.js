fetch("http://localhost:3000/prestamos/1", {
    method: "DELETE"
}).then(res => res.json()).then(data => console.log(data)); 