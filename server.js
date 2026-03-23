const express = require('express');
const {Pool} = require('pg');
const cors = require('cors');

const app=express();

app.use(express.json());

app.use(cors());

const pool= new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'biblioteca_bd',
    password: '12345678',
    port: 5432
});

//GET
app.get('/autores', async(req,res) => {
    try{
        const result= await pool.query('select * from autores');
        res.json(result.rows); // Esto devuelve todos los estudiantes de la bd
    }catch(error){
        res.status(500).json({ error: error.message});
    }
});

app.get('/categorias', async(req,res) => {
    try{
        const result= await pool.query('select * from categorias');
        res.json(result.rows); 
    }catch(error){
        res.status(500).json({ error: error.message});
    }
});

app.get('/libros', async(req,res) => {
    try{
        const result= await pool.query('select * from libros');
        res.json(result.rows); 
    }catch(error){
        res.status(500).json({ error: error.message});
    }
});

app.get('/estudiantes', async(req,res) => {
    try{
        const result= await pool.query('select * from estudiantes');
        res.json(result.rows); 
    }catch(error){
        res.status(500).json({ error: error.message});
    }
});

app.get('/prestamos', async(req,res) => {
    try{
        const result= await pool.query('select * from prestamos');
        res.json(result.rows); 
    }catch(error){
        res.status(500).json({ error: error.message});
    }
});

app.get('/', async(req,res) => {
    try{
        res.json({mensaje: 'Api funcionando correctamente'}); 
    }catch(error){
        res.status(500).json({ error: error.message});
    }
});

//GET por ID
app.get('/autores/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM autores WHERE id_autor = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Autor no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/categorias/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM categorias WHERE id_categoria = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/libros/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM libros WHERE id_libro = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/estudiantes/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM estudiantes WHERE id_estudiante = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/prestamos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM prestamos WHERE id_prestamo = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//POST
app.post('/autores', async (req,res) => {
    try{

        const {nombre, nacionalidad, fecha_nacimiento} = req.body;

        const result = await pool.query(
            'INSERT INTO autores (nombre, nacionalidad, fecha_nacimiento) VALUES ($1,$2,$3)',
            [nombre, nacionalidad, fecha_nacimiento]
        );

        res.json({
            mensaje: "autor aniadido correctamente",
            colegio: result.rows[0]
        })

    }catch(error){
        res.status(500).json({error:error.message});
    }
});

app.post('/categorias', async (req,res) => {
    try{

        const {nombre, descripcion} = req.body;

        const result = await pool.query(
            'INSERT INTO categorias (nombre, descripcion) VALUES ($1,$2)',
            [nombre, descripcion]
        );

        res.json({
            mensaje: "categoria aniadida correctamente",
            colegio: result.rows[0]
        })

    }catch(error){
        res.status(500).json({error:error.message});
    }
});

app.post('/libros', async (req,res) => {
    try{

        const {titulo, id_autor, id_categoria, anio_publicacion, numero_identificacion, cantidad} = req.body;

        const result = await pool.query(
            'INSERT INTO libros (titulo, id_autor, id_categoria, anio_publicacion, numero_identificacion, cantidad) VALUES ($1,$2,$3,$4,$5,$6)',
            [titulo, id_autor, id_categoria, anio_publicacion, numero_identificacion, cantidad]
        );

        res.json({
            mensaje: "libro aniadido correctamente",
            colegio: result.rows[0]
        })

    }catch(error){
        res.status(500).json({error:error.message});
    }
});

app.post('/estudiantes', async (req,res) => {
    try{

        const {nombre, apellido, carrera, email, telefono, fecha_registro} = req.body;

        const result = await pool.query(
            'INSERT INTO estudiantes (nombre, apellido, carrera, email, telefono, fecha_registro) VALUES ($1,$2,$3,$4,$5,$6)',
            [nombre, apellido, carrera, email, telefono, fecha_registro]
        );

        res.json({
            mensaje: "estudiante aniadido correctamente",
            colegio: result.rows[0]
        })

    }catch(error){
        res.status(500).json({error:error.message});
    }
});

app.post('/prestamos', async (req,res) => {
    try{

        const {id_libro, id_estudiante, fecha_prestamo, fecha_devolucion, estado} = req.body;

        const result = await pool.query(
            'INSERT INTO prestamos (id_libro, id_estudiante, fecha_prestamo, fecha_devolucion, estado) VALUES ($1,$2,$3,$4,$5)',
            [id_libro, id_estudiante, fecha_prestamo, fecha_devolucion, estado]
        );

        res.json({
            mensaje: "prestamo creado correctamente",
            colegio: result.rows[0]
        })

    }catch(error){
        res.status(500).json({error:error.message});
    }
});

//DELETE
app.delete('/autores/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM autores WHERE id_autor = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Autor no encontrado' });
        }

        res.json({
            mensaje: 'Autor eliminado correctamente',
            autor: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/categorias/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM categorias WHERE id_categoria = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }

        res.json({
            mensaje: 'Categoría eliminada correctamente',
            categoria: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/libros/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM libros WHERE id_libro = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }

        res.json({
            mensaje: 'Libro eliminado correctamente',
            libro: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/estudiantes/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM estudiantes WHERE id_estudiante = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }

        res.json({
            mensaje: 'Estudiante eliminado correctamente',
            estudiante: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/prestamos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM prestamos WHERE id_prestamo = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
        }

        res.json({
            mensaje: 'Préstamo eliminado correctamente',
            prestamo: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log("Servidor corriendo en la ruta http://localhost:3000");
});