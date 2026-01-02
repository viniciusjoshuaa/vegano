const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// LOGIN
app.post('/login', (req,res)=>{
  const {email,password} = req.body;
  db.query('SELECT * FROM users WHERE email=?',[email],(e,r)=>{
    if(!r.length) return res.status(401).json({msg:'Usuário não encontrado'});
    if(!bcrypt.compareSync(password,r[0].password))
      return res.status(401).json({msg:'Senha inválida'});
    res.json({token: jwt.sign({id:r[0].id},'secret')});
  });
});

// CRUD PRODUTOS
app.get('/products',(req,res)=>{
  db.query('SELECT * FROM products',(e,r)=>res.json(r));
});

app.post('/products',(req,res)=>{
  const {name,description,price}=req.body;
  db.query('INSERT INTO products VALUES (NULL,?,?,?)',[name,description,price]);
  res.json({msg:'Produto criado'});
});

app.put('/products/:id',(req,res)=>{
  const {name,price}=req.body;
  db.query('UPDATE products SET name=?,price=? WHERE id=?',[name,price,req.params.id]);
  res.json({msg:'Atualizado'});
});

app.delete('/products/:id',(req,res)=>{
  db.query('DELETE FROM products WHERE id=?',[req.params.id]);
  res.json({msg:'Removido'});
});

app.listen(3000,()=>console.log('Servidor rodando'));
