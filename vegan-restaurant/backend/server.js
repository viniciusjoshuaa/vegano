const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('./db'); // conexão com MySQL

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// ---------- SERVIR ARQUIVOS ESTÁTICOS ----------
app.use(express.static(path.join(__dirname, '../frontend'))); // mantém navbar, style.css, htmls

// ---------- REDIRECIONAMENTO RAIZ ----------
app.get('/', (req, res) => {
  res.redirect('/admin.html'); // ao acessar "/", abre admin.html
});

// ---------- USUÁRIOS ----------
app.post('/users', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO users (username,password,role) VALUES (?,?,?)',
      [username, hash, role || 'cliente'],
      (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ id: result.insertId });
      }
    );
  } catch (e) {
    res.status(500).send(e);
  }
});

// ---------- CLIENTES ----------
app.post('/clients', (req, res) => {
  const { user_id, name, email, phone, address } = req.body;
  db.query(
    'INSERT INTO clients (user_id,name,email,phone,address) VALUES (?,?,?,?,?)',
    [user_id, name, email, phone, address],
    (err, result) => err ? res.status(500).send(err) : res.json({ id: result.insertId })
  );
});

app.get('/clients', (req, res) => {
  db.query(
    'SELECT c.*, u.username FROM clients c JOIN users u ON c.user_id=u.id',
    (err, result) => err ? res.status(500).send(err) : res.json(result)
  );
});

// ---------- PRATOS ----------
app.get('/dishes', (req, res) =>
  db.query('SELECT * FROM dishes', (err, result) => err ? res.status(500).send(err) : res.json(result))
);

app.post('/dishes', (req, res) => {
  const { name, description, ingredients, allergens, image, price } = req.body;
  db.query(
    'INSERT INTO dishes (name,description,ingredients,allergens,image,price) VALUES (?,?,?,?,?,?)',
    [name, description, ingredients, allergens, image, price],
    (err, result) => err ? res.status(500).send(err) : res.json({ id: result.insertId })
  );
});

app.put('/dishes/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, ingredients, allergens, image, price } = req.body;
  db.query(
    'UPDATE dishes SET name=?,description=?,ingredients=?,allergens=?,image=?,price=? WHERE id=?',
    [name, description, ingredients, allergens, image, price, id],
    (err) => err ? res.status(500).send(err) : res.json({ message: 'Atualizado!' })
  );
});

app.delete('/dishes/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'DELETE FROM dishes WHERE id=?',
    [id],
    (err) => err ? res.status(500).send(err) : res.json({ message: 'Removido!' })
  );
});

// ---------- PEDIDOS ----------
app.post('/orders', (req, res) => {
  const { client_id, total, items } = req.body;
  db.query(
    'INSERT INTO orders (client_id,total) VALUES (?,?)',
    [client_id, total],
    (err, result) => {
      if (err) return res.status(500).send(err);
      const orderId = result.insertId;
      const orderItems = items.map(item => [orderId, item.dish_id, item.quantity, item.price]);
      db.query(
        'INSERT INTO order_items (order_id,dish_id,quantity,price) VALUES ?',
        [orderItems],
        (err2) => err2 ? res.status(500).send(err2) : res.json({ orderId })
      );
    }
  );
});

app.get('/orders', (req, res) => {
  const client_id = req.query.client_id;
  let sql = 'SELECT * FROM orders';
  if (client_id) sql += ' WHERE client_id=' + client_id;
  db.query(sql, (err, result) => err ? res.status(500).send(err) : res.json(result));
});

// ---------- INICIAR SERVIDOR ----------
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));