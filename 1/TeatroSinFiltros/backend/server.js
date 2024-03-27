const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const https = require('https');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const verificarToken = require('../middlewares/authMiddleware');
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');

const app = express();
app.use(cors({
    origin: 'http://localhost:4200' 
}));


const httpsAgent = new https.Agent({  
  rejectUnauthorized: false // ADVERTENCIA: Esto desactiva la verificación de SSL.
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL 
});



const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json());


app.post('/api/usuarios' ,verificarToken,async (req, res) => {
  const { nombreUsuario, email, contrasena } = req.body;

  if (!nombreUsuario || !email || !contrasena) {
      return res.status(400).send('Todos los campos son necesarios');
  }

  try {
    const contrasenaHash = await bcrypt.hash(contrasena, 10);
    const rol = 2; 
    const query = 'INSERT INTO usuarios (nombre_usuario, contrasena_hash, email, rol) VALUES (?, ?, ?, ?)';
    db.query(query, [nombreUsuario, contrasenaHash, email, rol], (err, result) => {
      if (err) {
        console.error('Error al insertar el usuario:', err);
       
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).send('Datos duplicados para este usuario');
        }

        return res.status(500).send('Error al insertar el usuario en la base de datos');
    }
        res.status(201).end();
    });
  } catch (error) {
      console.error('Error en el proceso de registro:', error);
      res.status(500).send('Error interno del servidor');
  }
});


/*
app.get('/api/obras', (req, res) => {
    const query = 'SELECT * FROM obras';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
      } else {
        res.json(results);
      }
    });
}); */

app.get('/api/obras/:id', (req, res) => {
  const obraId = req.params.id;
  const query = 'SELECT * FROM obras WHERE id = ?';

  db.query(query, [obraId], (err, results) => {
      if (err) {
          console.error('Error al obtener la obra:', err);
          res.status(500).send('Error en el servidor');
      } else if (results.length > 0) {
          res.json(results[0]);
      } else {
          res.status(404).send('Obra no encontrada');
      }
  });
});

app.put('/api/obras/:id',verificarToken, (req, res) => {
    const obraId = req.params.id;
    const { titulo, imagen_url, descripcion,categoria,duracion } = req.body;
    if (!titulo || !imagen_url || !descripcion) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    const updateQuery = 'UPDATE obras SET titulo = ?, imagen_url = ?, descripcion = ?, categoria = ? , duracion = ?  WHERE id = ?';

    db.query(updateQuery, [titulo, imagen_url, descripcion, obraId,categoria,duracion], (err, result) => {
      if (err.code == 'ER_DUP_ENTRY') {
        return res.status(409).json({ mensaje: 'Ya existe una obra con ese título' });
      }  
      else if (err) {
            console.error('Error al actualizar la obra:', err);
            return res.status(500).send('Error interno del servidor');
     }
        res.json({ mensaje: 'Obra actualizada con éxito', id: obraId });
    });
});


app.post('/api/obras',verificarToken, (req, res) => {
  const { titulo, imagen_url, descripcion,categoria,duracion } = req.body;

  const verificarQuery = 'SELECT * FROM obras WHERE LOWER(titulo) = LOWER(?)';

  db.query(verificarQuery, [titulo], (verificarErr, verificarResult) => {
    if (verificarErr) {
      return res.status(500).send('Error interno del servidor');
    }
    
    if (verificarResult.length > 0) {
      return res.status(409).send('Ya existe una obra con ese título');
    }

    const insertQuery = 'INSERT INTO obras (titulo, imagen_url, descripcion,categoria,duracion) VALUES (?, ?, ?,?,?)';
    db.query(insertQuery, [titulo, imagen_url, descripcion,categoria,duracion], (insertErr, insertResult) => {
      if (insertErr) {
        console.error('Error al insertar la obra:', insertErr);
        return res.status(500).send('Error interno del servidor');
      }
      res.status(201).json({ mensaje: 'Obra creada con éxito', id: insertResult.insertId });
    });
  });
});

app.delete('/api/obras/:id',verificarToken, (req, res) => {
  const { id } = req.params;
  const deleteQuery = 'DELETE FROM obras WHERE id = ?';

  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar la obra:', err);
      return res.status(500).send('Error interno del servidor');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Obra no encontrada');
    }

    res.status(200).send('Obra eliminada con éxito');
  });
});

app.post('/api/login', (req, res) => {
  const { nombre_usuario, contrasena } = req.body;
  const query = 'SELECT * FROM usuarios WHERE nombre_usuario = ?';

  db.query(query, [nombre_usuario], (err, result) => {
      if (err) {
          res.status(500).send('Error en el servidor');
          return;
      }

      if (result.length > 0) {
          bcrypt.compare(contrasena, result[0].contrasena_hash, (err, isMatch) => {
              if (err) {
                  res.status(500).send('Error al comparar contraseñas');
                  return;
              }
              
              if (isMatch) {
                  const token = jwt.sign(
                      { id: result[0].id, rol: result[0].rol },
                      process.env.JWT_SECRET, 
                      { expiresIn: '1h' }
                  );
                  res.json({ mensaje: "Autenticación exitosa", token , rol: result[0].rol});
              } else {
                  res.status(401).send(result[0].contrasena_hash);
              }
          });
      } else {
          res.status(404).send('Usuario no encontrado');
      }
  });
});

app.get('/api/asientos/:idSala', (req, res) => {
  const idSala = req.params.idSala;
  const query = 'SELECT * FROM Butacas WHERE id_sala = ?';

  db.query(query, [idSala], (err, results) => {
    if (err) {
      console.error('Error al consultar los asientos:', err);
      return res.status(500).send('Error en el servidor');
    }
    res.json(results);
  });
});

app.get('/api/asientosFunciones/:idSala', (req, res) => {
  const idSala = req.params.idSala;
  const query = 'SELECT * FROM butacas_funciones WHERE id_salas_funciones = ?';

  db.query(query, [idSala], (err, results) => {
    if (err) {
      console.error('Error al consultar los asientos:', err);
      return res.status(500).send('Error en el servidor');
    }
    res.json(results);
  });
});

app.post('/api/reserva', (req, res) => {
  const { nombreUsuario, cantidadButacas, id_reservas_teatrales, butacasSeleccionadas } = req.body;

  const queryReserva = 'INSERT INTO reservas (nombre_usuario, cantidad_butacas, id_reservas_teatrales) VALUES (?, ?, ?)';
  db.query(queryReserva, [nombreUsuario, cantidadButacas, id_reservas_teatrales], (err, resultReserva) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al guardar la reserva en la base de datos');
      return;
    }

    const reservaId = resultReserva.insertId; 
    const queryButacas = 'UPDATE butacas_funciones SET estado = "ocupado", id_reserva = ? WHERE id_butaca IN (?)';
    db.query(queryButacas, [reservaId, butacasSeleccionadas], (err, resultButacas) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al actualizar las butacas');
        return;
      }

      res.status(201).json({ mensaje: "Reserva creada y butacas actualizadas con éxito", idReserva: reservaId });
    });
  });
});

app.get('/api/obra/:id_obra/sala', (req, res) => {
  const idObra = req.params.id_obra;
  const query = 'SELECT id_sala_funciones, id_reservas_teatrales FROM reservas_teatrales WHERE id_reservas_teatrales = ?';

  db.query(query, [idObra], (err, results) => {
      if (err) {
          return res.status(500).send('Error en el servidor');
      }

      if (results.length > 0) {
          res.json(results[0]);
      } else {
          res.status(404).send('No se encontró la obra para la sala dada');
      }
  });
});

app.post('/api/salas',verificarToken, (req, res) => {
  const { nombre_sala, num_filas, num_columnas, asientos } = req.body;

  const verificarQuery = 'SELECT * FROM salas WHERE LOWER(nombre_sala) = LOWER(?)';
  db.query(verificarQuery, [nombre_sala], (verificarErr, verificarResult) => {
    if (verificarErr) {
      console.error('Error al verificar la sala:', verificarErr);
      return res.status(500).send('Error interno del servidor');
    }
    
    if (verificarResult.length > 0) {
      return res.status(409).send('Ya existe una sala con ese nombre');
    }

    const insertQuery = 'INSERT INTO salas (nombre_sala, num_filas, num_columnas) VALUES (?, ?, ?)';
    db.query(insertQuery, [nombre_sala, num_filas, num_columnas], (insertErr, insertResult) => {
      if (insertErr) {
        console.error('Error al insertar la sala:', insertErr);
        return res.status(500).send('Error interno del servidor');
      }
      const idSala = insertResult.insertId;

      if (!asientos || asientos.length === 0) {
        return res.status(400).send('No se proporcionaron asientos o el arreglo está vacío');
      }

      const asientosInsertados = asientos.map(asiento => {
        const { fila, columna, estado } = asiento;
        return new Promise((resolve, reject) => {
          const insertAsientoQuery = 'INSERT INTO butacas (id_sala, fila, columna, estado) VALUES (?, ?, ?, ?)';
          db.query(insertAsientoQuery, [idSala, fila, columna, estado], (insertAsientoErr, insertAsientoResult) => {
            if (insertAsientoErr) {
              reject(insertAsientoErr);
            } else {
              resolve(insertAsientoResult);
            }
          });
        });
      });

      Promise.all(asientosInsertados)
        .then(() => {
          res.status(201).json({ mensaje: 'Sala y asientos creados con éxito', id: idSala });
        })
        .catch((error) => {
          console.error('Error al insertar asientos:', error);
          res.status(500).send('Error al insertar asientos');
        });
    });
  });
});

app.put('/api/salas/:id',verificarToken, async (req, res) => {
  const { id } = req.params;
  const { nombre_sala, num_filas, num_columnas, asientos, id_sala } = req.body;

  const updateSalaQuery = 'UPDATE salas SET nombre_sala = ?, num_filas = ?, num_columnas = ? WHERE id_sala = ?';

  try {
   db.query(updateSalaQuery, [nombre_sala, num_filas, num_columnas, id_sala]);
    const promises = asientos.map(asiento => {
      const { fila, columna, estado } = asiento;
      const updateAsientoQuery = 'UPDATE butacas SET estado = ? WHERE fila = ? AND columna = ? AND id_sala = ?';
      return db.query(updateAsientoQuery, [estado, fila, columna, id_sala]);
    });

    Promise.all(promises);
    res.json({ mensaje: 'Sala y asientos actualizados con éxito' });
  } catch (error) {
    console.error('Error al actualizar la sala o asientos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/api/usuarios', (req, res) => {
  const query = 'SELECT id_usuario, nombre_usuario, email, rol FROM usuarios';

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
});

app.delete('/api/usuarios/:id',verificarToken, (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM usuarios WHERE id_usuario = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el usuario:', err);
      res.status(500).send('Error en el servidor');
    } else {
      res.status(204).send(); 
    }
  });
});

app.put('/api/usuarios/:id',verificarToken, (req, res) => {
  const { id } = req.params; 
  const { nombre_usuario, email, rol } = req.body; 

  const queryVerificacion = 'SELECT * FROM usuarios WHERE (nombre_usuario = ? OR email = ?) AND id_usuario != ?';

  db.query(queryVerificacion, [nombre_usuario, email, id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error en el servidor');
    }

    if (results.length > 0) {
      return res.status(409).send('El nombre de usuario o correo electrónico ya está en uso por otro usuario');
    }

    const updateQuery = 'UPDATE usuarios SET nombre_usuario = ?, email = ?, rol = ? WHERE id_usuario = ?';

    db.query(updateQuery, [nombre_usuario, email, rol, id], (updateErr, updateResults) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).send('Error al actualizar el usuario');
      }
      res.send({ mensaje: 'Usuario actualizado con éxito' });
    });
  });
});

app.get('/api/salas', (req, res) => {
  const query = 'SELECT id_sala, nombre_sala, num_filas, num_columnas FROM salas';

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
});

app.get('/api/salas/:id', (req, res) => {
  const { id } = req.params; 
  const query = 'SELECT id_sala, nombre_sala, num_filas, num_columnas FROM salas WHERE id_sala = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error en el servidor');
    } else {
      if (results.length > 0) {
        res.json(results[0]); 
      } else {
        res.status(404).send('Sala no encontrada');
      }
    }
  });
});

app.get('/api/salas_funciones/:id', (req, res) => {
  const { id } = req.params; 
  const query = 'SELECT id_sala, nombre_sala, num_filas, num_columnas FROM salas_funciones WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error en el servidor');
    } else {
      if (results.length > 0) {
        res.json(results[0]); 
      } else {
        res.status(404).send('Sala no encontrada');
      }
    }
  });
});


app.delete('/api/salas/:id',verificarToken, (req, res) => {
  const { id } = req.params;
  
  const queryAsientos = 'DELETE FROM butacas WHERE id_sala = ?';

  db.query(queryAsientos, [id], (errAsientos, resultAsientos) => {
    if (errAsientos) {
      console.error('Error al eliminar asientos de la sala:', errAsientos);
      return res.status(500).send('Error al eliminar asientos de la sala');
    }

    const querySala = 'DELETE FROM salas WHERE id_sala = ?';

    db.query(querySala, [id], (errSala, resultSala) => {
      if (errSala) {
        console.error('Error al eliminar la sala:', errSala);
        return res.status(500).send('Error al eliminar la sala');
      }

      if (resultSala.affectedRows > 0) {
        res.status(200).send({ message: 'Sala y asientos asociados eliminados con éxito' });
      } else {
        res.status(404).send({ message: 'Sala no encontrada' });
      }
    });
  });
});


app.post('/api/reservas_teatrales', verificarToken, (req, res) => {
  const { id_obra, id_sala, fecha_hora } = req.body;
  console.log(id_sala);
    const selectSalaQuery = 'SELECT * FROM salas WHERE id_sala = ?';
    db.query(selectSalaQuery, [id_sala], (selectErr, selectResult) => {
      if (selectErr) {
        console.error('Error al seleccionar los datos de la sala:', selectErr);
        return res.status(500).send('Error interno del servidor al seleccionar los datos de la sala');
      }

      if (selectResult.length === 0) {
        return res.status(404).send('Sala no encontrada');
      }

      const sala = selectResult[0];
      const insertSalasFuncionesQuery = 'INSERT INTO salas_funciones (id_sala, nombre_sala, num_filas, num_columnas) VALUES (?, ?, ?, ?)';
      db.query(insertSalasFuncionesQuery, [sala.id_sala, sala.nombre_sala, sala.num_filas, sala.num_columnas], (errorSalasFunciones, resultSalasFunciones) => {
        if (errorSalasFunciones) {
          console.error('Error al insertar en salas_funciones:', errorSalasFunciones);
          return res.status(500).send('Error interno del servidor al insertar en salas_funciones');
        }
        const idSalasFunciones = resultSalasFunciones.insertId;

        const selectButacasQuery = 'SELECT * FROM butacas WHERE id_sala = ?';
        db.query(selectButacasQuery, [id_sala], (errorButacas, resultadosButacas) => {
          if (errorButacas) {
            console.error('Error al seleccionar las butacas:', errorButacas);
            return res.status(500).send('Error interno del servidor al seleccionar las butacas');
          }

          resultadosButacas.forEach(butaca => {
            const insertButacasFuncionesQuery = 'INSERT INTO butacas_funciones (fila, columna, estado, id_salas_funciones) VALUES ( ?, ?, ?, ?)';
            db.query(insertButacasFuncionesQuery, [butaca.fila, butaca.columna, butaca.estado, idSalasFunciones], (errorInsert, resultInsert) => {
              if (errorInsert) {
                console.error('Error al insertar butaca en butacas_funciones:', errorInsert);
              }
            }); 
          }); 

          
          const insertQuery = 'INSERT INTO reservas_teatrales (id_obra, id_sala_funciones, fecha_hora) VALUES (?, ?, ?)';
          db.query(insertQuery, [id_obra, idSalasFunciones, fecha_hora], (insertErr, insertResult) => {
            if (insertErr) {
              console.error('Error al insertar la reserva:', insertErr);
              return res.status(500).send('Error interno del servidor al insertar la reserva');
            }
            res.status(201).json({ mensaje: 'Reserva creada con éxito', id: insertResult.insertId });
          });
        }); 
      }); 
    }); 
  });

  app.put('/api/reservas_teatrales/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const { id_obra, id_sala, fecha_hora } = req.body;
  
    const verificarReservaQuery = 'SELECT * FROM reservas_teatrales WHERE id_reservas_teatrales = ?';
    db.query(verificarReservaQuery, [id], (verificarErr, verificarResult) => {
      if (verificarErr) {
        console.error('Error al verificar la reserva:', verificarErr);
        return res.status(500).send('Error interno del servidor');
      }
      if (verificarResult.length === 0) {
        return res.status(404).send('Reserva no encontrada');
      }
  
      const selectSalaQuery = 'SELECT * FROM salas WHERE id_sala = ?';
      db.query(selectSalaQuery, [id_sala], (selectErr, selectResult) => {
        if (selectErr || selectResult.length === 0) {
          console.error('Error al seleccionar los datos de la sala:', selectErr);
          return res.status(selectErr ? 500 : 404).send(selectErr ? 'Error interno del servidor al seleccionar los datos de la sala' : 'Sala no encontrada');
        }
  
        const sala = selectResult[0];
        console.log(sala);  
        const insertSalasFuncionesQuery = 'INSERT INTO salas_funciones (id_sala, num_filas, num_columnas,nombre_sala) VALUES (?, ?, ?, ?)';
        db.query(insertSalasFuncionesQuery, [sala.id_sala, sala.num_filas, sala.num_columnas,sala.nombre_sala], (errorSalasFunciones, resultSalasFunciones) => {
          if (errorSalasFunciones) {
            console.error('Error al insertar en salas_funciones:', errorSalasFunciones);
            return res.status(500).send('Error interno del servidor al insertar en salas_funciones');
          }

          
        const idSalasFunciones = resultSalasFunciones.insertId;
        const selectButacasQuery = 'SELECT * FROM butacas WHERE id_sala = ?';
        db.query(selectButacasQuery, [id_sala], (errorButacas, resultadosButacas) => {
          if (errorButacas) {
            console.error('Error al seleccionar las butacas:', errorButacas);
            return res.status(500).send('Error interno del servidor al seleccionar las butacas');
          }

          resultadosButacas.forEach(butaca => {
            const insertButacasFuncionesQuery = 'INSERT INTO butacas_funciones (fila, columna, estado, id_salas_funciones) VALUES ( ?, ?, ?, ?)';
            db.query(insertButacasFuncionesQuery, [butaca.fila, butaca.columna, butaca.estado, idSalasFunciones], (errorInsert, resultInsert) => {
              if (errorInsert) {
                console.error('Error al insertar butaca en butacas_funciones:', errorInsert);
              }
            }); 
          }); 
       
          console.log(idSalasFunciones);
          const updateReservaQuery = 'UPDATE reservas_teatrales SET id_obra = ?, id_sala_funciones = ?, fecha_hora = ? WHERE id_reservas_teatrales = ?';
          db.query(updateReservaQuery, [id_obra, idSalasFunciones, fecha_hora, id], (updateErr, updateResult) => {
            if (updateErr) {
              console.error('Error al actualizar la reserva:', updateErr);
              return res.status(500).send('Error interno del servidor al actualizar la reserva');
            }
            res.json({ mensaje: 'Reserva actualizada con éxito' });
          });
        });
      });
    });
  });
});

app.get('/api/reservas_teatrales', (req, res) => {
  const query = 'SELECT rt.id_reservas_teatrales, rt.fecha_hora, o.titulo as obra, s.nombre_sala as sala ' +
  ' FROM reservas_teatrales rt JOIN obras o ON rt.id_obra = o.id JOIN salas_funciones s ON rt.id_sala_funciones = s.id';

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
});

app.get('/api/reservas_teatrales/:id', (req, res) => {
  const { id } = req.params; 
  const query = 'SELECT * FROM reservas_teatrales WHERE id_reservas_teatrales = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al obtener la reserva:', err);
      res.status(500).send('Error en el servidor');
    } else {
      if (result.length > 0) {
        res.json(result[0]); 
      } else {
        res.status(404).send('Reserva no encontrada');
      }
    }
  });
});

app.get('/api/reservas_teatrales_obras', (req, res) => {
  const query = 'SELECT rt.id_reservas_teatrales,o.id , o.descripcion , o.titulo, o.imagen_url ' +
  ' FROM reservas_teatrales rt JOIN obras o ON rt.id_obra = o.id';

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
});



app.delete('/api/reservas_teatrales/:id',verificarToken, (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM reservas_teatrales WHERE id_reservas_teatrales = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar la reserva:', err);
      res.status(500).send('Error en el servidor');
    } else {
      if (result.affectedRows > 0) {
        res.status(200).send({ message: 'Reserva eliminada con éxito' });
      } else {
        res.status(404).send({ message: 'Reserva no encontrada' });
      }
    }
  });
});

app.get('/api/reserva', (req, res) => {
  const query = 'SELECT r.id_reservas, r.nombre_usuario, r.cantidad_butacas, r.id_reservas_teatrales, o.titulo, rt.fecha_hora ' +
  'FROM reservas r INNER JOIN reservas_teatrales rt on r.id_reservas_teatrales = rt.id_reservas_teatrales INNER JOIN obras o on o.id = rt.id_obra';

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error al obtener las reservas:', err);
          res.status(500).send('Error en el servidor');
      } else {
          res.json(results);
      }
  });
});

app.delete('/api/reserva/:id', verificarToken, (req, res) => {
  const { id } = req.params;

  const queryActualizarButacas = 'UPDATE butacas_funciones SET estado = "disponible", id_reserva = NULL WHERE id_reserva = ?';

  db.query(queryActualizarButacas, [id], (err, result) => {
    if (err) {
      console.error('Error al actualizar las butacas:', err);
      res.status(500).send('Error en el servidor al actualizar las butacas');
      return;
    }

    const queryEliminarReserva = 'DELETE FROM reservas WHERE id_reservas = ?';
    
    db.query(queryEliminarReserva, [id], (err, resultDelete) => {
      if (err) {
        console.error('Error al eliminar la reserva:', err);
        res.status(500).send('Error en el servidor al eliminar la reserva');
        return;
      }

      if (resultDelete.affectedRows > 0) {
        res.status(200).send({ message: 'Reserva y butacas de la reserva eliminadas con éxito' });
      } else {
        res.status(404).send({ message: 'Reserva no encontrada' });
      }
    });
  });
});


app.get('/actores', async (req, res) => {
  const SUPABASE_URL = 'https://dqpcisxtwsasxfdtqdwd.supabase.co/rest/v1/actores';
  const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcGNpc3h0d3Nhc3hmZHRxZHdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE0NzQ3MDEsImV4cCI6MjAyNzA1MDcwMX0.ZTJGt2t6xTEP2QZCdkR6qjgRkGnUhkqtD_xzlKFO_6s';

  const agent = new https.Agent({  
    rejectUnauthorized: false // IGNORA los certificados no autorizados
  });

  try {
    const response = await axios.get(SUPABASE_URL, {
      headers: {
        'apikey': API_KEY,
        'Authorization': `Bearer ${API_KEY}`,
      },
      httpsAgent: agent // Usa el agente personalizado
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error al realizar la solicitud a Supabase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});




app.get('/api/actores/:id', (req, res) => {

  const { id } = req.params;
  const query = 'SELECT * FROM actores WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al obtener el actor:', err);
      res.status(500).send('Error en el servidor');
    } else if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).send('Actor no encontrado');
    }
  });
});

app.post('/api/actores',verificarToken, (req, res) => {
  const { nombre, imagen_url, descripcion } = req.body;

  const verificarQuery = 'SELECT * FROM actores WHERE LOWER(nombre) = LOWER(?)';

  db.query(verificarQuery, [nombre], (verificarErr, verificarResult) => {
    if (verificarErr) {
      return res.status(500).send('Error interno del servidor al verificar el actor');
    }
    
    if (verificarResult.length > 0) {
      return res.status(409).send('Ya existe un actor con ese nombre');
    }

    const insertQuery = 'INSERT INTO actores (nombre, imagen_url, descripcion) VALUES (?, ?, ?)';
    db.query(insertQuery, [nombre, imagen_url, descripcion], (insertErr, insertResult) => {
      if (insertErr) {
        console.error('Error al insertar el actor:', insertErr);
        return res.status(500).send('Error interno del servidor al insertar el actor');
      }
      res.status(201).json({ mensaje: 'Actor creado con éxito', id: insertResult.insertId });
    });
  });
});

app.put('/api/actores/:id',verificarToken, (req, res) => {
  const { id } = req.params;
  const { nombre, imagen_url, descripcion } = req.body;

  const verificarQuery = 'SELECT * FROM actores WHERE id = ?';

  db.query(verificarQuery, [id], (verificarErr, verificarResults) => {
    if (verificarErr) {
      console.error('Error al verificar el actor:', verificarErr);
      return res.status(500).send('Error interno del servidor al verificar el actor');
    }

    if (verificarResults.length > 0) {
      const updateQuery = 'UPDATE actores SET nombre = ?, imagen_url = ?, descripcion = ? WHERE id = ?';

      db.query(updateQuery, [nombre, imagen_url, descripcion, id], (updateErr, updateResult) => {
        if (updateErr) {
          console.error('Error al actualizar el actor:', updateErr);
          return res.status(500).send('Error interno del servidor al actualizar el actor');
        }
        res.json({ mensaje: 'Actor actualizado con éxito', id });
      });
    } else {
      return res.status(404).send('Actor no encontrado');
    }
  });
});

app.delete('/api/actores/:id',verificarToken,(req, res) => {
  const { id } = req.params; 
  const query = 'DELETE FROM actores WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el actor:', err);
      res.status(500).send('Error en el servidor');
    } else {
      if (result.affectedRows === 0) {
        res.status(404).send('Actor no encontrado');
      } else {
        res.status(200).send('Actor eliminado exitosamente');
      }
    }
  });
});

app.post('/api/actores_obra',verificarToken, (req, res) => {
  const { actor_id, obra_id } = req.body;

  const verificarExistenciaQuery = `
      SELECT (SELECT 1 FROM actores WHERE id = ?) AS actorExiste,
             (SELECT 1 FROM obras WHERE id = ?) AS obraExiste;
  `;
  db.query(verificarExistenciaQuery, [actor_id, obra_id], (verificarErr, verificarResults) => {
      if (verificarErr) {
          console.error('Error al verificar existencia de actor y obra:', verificarErr);
          return res.status(500).send('Error interno del servidor');
      }
      if (!verificarResults || verificarResults.length === 0 || !verificarResults[0].actorExiste || !verificarResults[0].obraExiste) {
          return res.status(404).send('Actor o Obra no encontrados');
      }

      const verificarQuery = 'SELECT * FROM actores_obra WHERE actor_id = ? AND obra_id = ?';
      db.query(verificarQuery, [actor_id, obra_id], (verificarErr, verificarResults) => {
          if (verificarErr) {
              console.error('Error al verificar la relación en actores_obra:', verificarErr);
              return res.status(500).send('Error interno del servidor al verificar la relación');
          }
      
          if (verificarResults.length > 0) {
              return res.status(409).send('Ya existe una relación entre el Actor y la Obra especificados');
          }
      
          const insertQuery = 'INSERT INTO actores_obra (actor_id, obra_id) VALUES (?, ?)';
          db.query(insertQuery, [actor_id, obra_id], (insertErr, insertResults) => {
              if (insertErr) {
                  console.error('Error al insertar en actores_obra:', insertErr);
                  return res.status(500).send('Error interno del servidor al insertar la relación');
              }
              res.status(201).json({ mensaje: 'Relación entre Actor y Obra creada con éxito', id: insertResults.insertId });
          });
      });
  });
});

app.get('/api/actores_obra/:id', (req, res) => {
  const { id } = req.params; 
  const query = `SELECT * FROM actores
    INNER JOIN actores_obra ON actores.id = actores_obra.actor_id
    WHERE actores_obra.obra_id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener los actores de la obra:', err);
      return res.status(500).send('Error interno del servidor');
    }
    res.json(results);
  });
});

app.delete('/api/actores_obra/:actorId',verificarToken, (req, res) => {
  const { actorId } = req.params;

  const query = 'DELETE FROM actores_obra WHERE id = ?'; 

  db.query(query, [actorId], (error, results) => {
    if (error) {
      console.error('Error al eliminar el actor de la obra:', error);
      return res.status(500).send('Error al eliminar el actor de la obra');
    }
    res.send({ mensaje: 'Actor eliminado de la obra con éxito' });
  });
});

app.get('/api/obras_actor/:id', (req, res) => {
  const { id } = req.params; 
  const query = `SELECT * FROM obras
    INNER JOIN actores_obra ON obras.id = actores_obra.obra_id
    WHERE actores_obra.actor_id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener las obras del actor:', err);
      return res.status(500).send('Error interno del servidor');
    }
    res.json(results);
  });
});

const PORT = process.env.PORT  || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

});

