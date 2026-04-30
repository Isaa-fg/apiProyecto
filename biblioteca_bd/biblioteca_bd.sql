CREATE TABLE autores (
    id_autor serial PRIMARY KEY,
    nombre VARCHAR(100),
    nacionalidad VARCHAR(50),
    fecha_nacimiento DATE
);

CREATE TABLE categorias (
    id_categoria serial PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion VARCHAR(150)
);

CREATE TABLE libros (
    id_libro serial PRIMARY KEY,
    titulo VARCHAR(150),
    id_autor INT,
    id_categoria INT,
    anio_publicacion INT,
    numero_identificacion VARCHAR(50) UNIQUE,
    cantidad INT,
    constraint fk_autor FOREIGN KEY (id_autor) REFERENCES autores(id_autor) on delete set null,
    constraint fk_categoria FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) on delete set null
);

CREATE TABLE estudiantes (
    id_estudiante serial PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    carrera VARCHAR(100),
    email VARCHAR(100),
    telefono VARCHAR(20),
    fecha_registro DATE
);

CREATE TABLE prestamos (
    id_prestamo serial PRIMARY KEY,
    id_libro INT,
    id_estudiante INT,
    fecha_prestamo DATE,
    fecha_devolucion DATE,
    estado VARCHAR(20),
    constraint fk_libro FOREIGN KEY (id_libro) REFERENCES libros(id_libro) on delete set null,
    constraint fk_estudiante FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante) on delete set null
);

INSERT INTO autores (nombre, nacionalidad, fecha_nacimiento) VALUES
('Gabriel García Márquez', 'Colombia', '1927-03-06'),
('J.K. Rowling', 'Reino Unido', '1965-07-31'),
('George Orwell', 'Reino Unido', '1903-06-25'),
('Isabel Allende', 'Chile', '1942-08-02'),
('Julio Cortázar', 'Argentina', '1914-08-26');

INSERT INTO categorias (nombre, descripcion) VALUES
('Novela', 'Obras narrativas extensas'),
('Fantasía', 'Historias con elementos mágicos'),
('Ciencia Ficción', 'Basadas en ciencia y tecnología'),
('Drama', 'Narraciones con conflictos emocionales'),
('Realismo Mágico', 'Mezcla de lo real y lo fantástico');

INSERT INTO libros (titulo, id_autor, id_categoria, anio_publicacion, numero_identificacion, cantidad) VALUES
('Cien años de soledad', 1, 5, 1967, 'LIB001', 5),
('Harry Potter y la piedra filosofal', 2, 2, 1997, 'LIB002', 8),
('1984', 3, 3, 1949, 'LIB003', 6),
('La casa de los espíritus', 4, 5, 1982, 'LIB004', 4),
('Rayuela', 5, 1, 1963, 'LIB005', 3);

INSERT INTO estudiantes (nombre, apellido, carrera, email, telefono, fecha_registro) VALUES
('Carlos', 'Pérez', 'Ingeniería', 'carlos@email.com', '8888-1111', '2026-01-10'),
('María', 'López', 'Literatura', 'maria@email.com', '8888-2222', '2026-01-15'),
('Juan', 'Rodríguez', 'Historia', 'juan@email.com', '8888-3333', '2026-02-01'),
('Ana', 'Gómez', 'Derecho', 'ana@email.com', '8888-4444', '2026-02-10'),
('Luis', 'Fernández', 'Arquitectura', 'luis@email.com', '8888-5555', '2026-02-20');

INSERT INTO prestamos (id_libro, id_estudiante, fecha_prestamo, fecha_devolucion, estado) VALUES
(1, 2, '2026-03-01', '2026-03-15', 'devuelto'),
(2, 1, '2026-03-05', '2026-03-20', 'pendiente'),
(3, 3, '2026-03-10', '2026-03-25', 'pendiente'),
(4, 4, '2026-03-12', '2026-03-26', 'pendiente'),
(5, 5, '2026-03-15', '2026-03-30', 'pendiente');