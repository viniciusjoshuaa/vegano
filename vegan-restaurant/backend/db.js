// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // seu usuário MySQL
  password: 'SUA_SENHA',
  database: 'mandir'   // nome do banco
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar no MySQL:', err);
  } else {
    console.log('Conectado ao MySQL!');
  }
});

module.exports = db;