const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Servir frontend
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (e, r) => {
    if (!r.length) return res.status(401).json({ msg: "Usuário não encontrado" });
    if (!bcrypt.compareSync(password, r[0].password))
      return res.status(401).json({ msg: "Senha inválida" });

    res.json({ token: jwt.sign({ id: r[0].id }, "secret") });
  });
});

// LISTAR PRATOS
app.get("/dishes", (req, res) => {
  db.query("SELECT * FROM dishes", (err, result) => res.json(result));
});

// CADASTRAR PRATO
app.post("/dishes", (req, res) => {
  const { name, description, ingredients, allergens, image, price } = req.body;

  db.query(
    "INSERT INTO dishes VALUES (NULL,?,?,?,?,?,?)",
    [name, description, ingredients, allergens, image, price],
    err => {
      if (err) return res.status(500).json({ msg: "Erro ao cadastrar" });
      res.json({ msg: "Prato cadastrado" });
    }
  );
});

app.listen(PORT, () => console.log("Servidor rodando na porta 3000"));