require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const {Pool} = require('pg');
const cors = require('cors');

const app=express();

app.use(express.json());

app.use(cors());

const pool= new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

//REGISTRO 
app.post('/auth/registro', async (req,res)=>{
    try {
        const {email,password}=req.body;
        //Generar Hash de contraseña
        const saltRounds = 10;//Decirle a bcrypt que ejecute 2^10 veces el algoritmo no paralelizable
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        //Guardar nuevo usuario en la BD
        const result = await pool.query('INSERT INTO api_users (email,password) VALUES ($1, $2) RETURNING id, email, creation_date',
            [email, hashedPassword]
        );
        res.status(201).json({
            mensaje: 'Usuario creado exitosamente',
            usuario: result.rows[0]
        });
    } catch (error) {
        if(error.code === '23505'){
            return res.status(400).json({error: "El email ya está en uso por otro usuario"+error.message});
        }
        res.status(500).json({error:"No se ha podido registrar en usuario: "+error.message})
    }
});

//LOGIN
app.post('/auth/login', async (req, res)=>{
    try {
        const {email, password} = req.body;
        const result = await pool.query('SELECT * FROM api_users WHERE email = $1',[email]);

        if (result.rows.length === 0) {
            return res.status(401).json({error: "Credenciales incorrectas"});
        }
        const usuario = result.rows[0];

        const Valida = await bcrypt.compare(password, usuario.password);
        if (!Valida) {
            return res.status(401).json({error: "Credenciales incorrectas"});
        }

        const token = jwt.sign({id: usuario.id}, process.env.JWT_SECRET,{expiresIn: '2h'});
        res.json({token});

    } catch (error) {
        res.status(500).json({error:"No se pudo inicar sesion: "+error.message});
    }
});

//MIDDLEWARE
const verificarToken = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({error: "Acceso denegado, se requiere token de autenticacion"});
    }
    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verificado;
        next();
    } catch (error) {
        res.status(401).json({error: "token invalidado: "+error.message});
    }
}; 


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
        const result= await pool.query('select libros.id_libro, libros.titulo, autores.nombre as nombre_autor, categorias.nombre as nombre_categoria, libros.anio_publicacion, libros.numero_identificacion, libros.cantidad from libros inner join autores on libros.id_autor=autores.id_autor inner join categorias on libros.id_categoria=categorias.id_categoria;');
        res.json(result.rows); 
    }catch(error){
        res.status(500).json({ error: error.message});
    }
});

app.get('/estudiantes', async(req,res) => {
    try{
        const result= await pool.query('Select * from estudiantes');
        res.json(result.rows); 
    }catch(error){
        res.status(500).json({ error: error.message});
    }
});

app.get('/prestamos', async(req,res) => {
    try{
        const result= await pool.query('select prestamos.id_prestamo, libros.titulo as titulo_libro, estudiantes.nombre as nombre_estudiante, prestamos.fecha_prestamo, prestamos.fecha_devolucion, prestamos.estado from prestamos inner join libros on prestamos.id_libro=libros.id_libro inner join estudiantes on prestamos.id_estudiante=estudiantes.id_estudiante;');
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
app.post('/autores', verificarToken, async (req,res) => {
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

app.post('/categorias', verificarToken, async (req,res) => {
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

app.post('/libros', verificarToken, async (req,res) => {
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

app.post('/estudiantes', verificarToken, async (req,res) => {
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

app.post('/prestamos', verificarToken, async (req,res) => {
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
app.delete('/autores/:id', verificarToken, async (req, res) => {
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

app.delete('/categorias/:id', verificarToken, async (req, res) => {
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

app.delete('/libros/:id', verificarToken, async (req, res) => {
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

app.delete('/estudiantes/:id', verificarToken, async (req, res) => {
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

app.delete('/prestamos/:id', verificarToken, async (req, res) => {
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