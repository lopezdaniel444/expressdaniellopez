const express = require('express');
const pool = require('./db');
const app = express();

app.use(express.json());

app.get('/materias', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM materia ORDER BY id ASC');
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las materias' });
  }
});

app.post('/materias', async (req, res) => {
  try {
    const { nombre, semestre, creditos } = req.body;

    if (!nombre || !semestre || !creditos) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const resultado = await pool.query(
      'INSERT INTO materia (nombre, semestre, creditos) VALUES ($1, $2, $3) RETURNING *',
      [nombre, semestre, creditos]
    );

    res.status(201).json({
      mensaje: 'Materia insertada correctamente',
      materia: resultado.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al insertar la materia' });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});