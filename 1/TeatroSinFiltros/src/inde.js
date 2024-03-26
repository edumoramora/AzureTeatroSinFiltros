const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// Middleware para parsear el cuerpo de las peticiones JSON
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host     : 'tu_host', // por ejemplo, 'localhost'
  user     : 'tu_usuario',
  password : 'tu_contraseña',
  database : 'tu_base_de_datos'
});

// Conectar a la base de datos MySQL
connection.connect(error => {
  if (error) throw error;
  console.log("Conexión exitosa a la base de datos.");
});

// Rutas de la API REST aquí
// Ejemplo: GET para obtener datos
app.get('/datos', (req, res) => {
  // Consulta SQL para obtener datos
  const sql = 'SELECT * FROM tu_tabla';
  
  // Ejecutar la consulta SQL
  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('No hay resultados');
    }
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
