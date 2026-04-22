const express = require('express');
const pool = require('./db');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.get('/alumnos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM alumno');
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los alumnos' });
  }
});

app.post('/alumnos', async (req, res) => {
  try {
    const { nombre, apellido, edad, correo } = req.body;

    if (!nombre || !apellido || !edad || !correo) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const resultado = await pool.query(
      'INSERT INTO alumno (nombre, apellido, edad, correo) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, apellido, edad, correo]
    );

    res.status(201).json({
      mensaje: 'Alumno insertado correctamente',
      alumno: resultado.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }
    res.status(500).json({ error: 'Error al insertar el alumno' });
  }
});

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});