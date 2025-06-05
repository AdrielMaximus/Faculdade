const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
app.use(express.json());

// Configuração do banco de dados
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1);
  }
  console.log('Conectado ao banco de dados!');
});


// Endpoint de cadastro de usuários
app.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;

  const hashedSenha = await bcrypt.hash(senha, 10);

  const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
  db.query(query, [nome, email, hashedSenha], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar usuário:', err);
      return res.status(500).send('Erro ao cadastrar usuário.');
    }
    res.status(201).send('Usuário cadastrado com sucesso!');
  });
});

// Endpoint de agendamento
app.post('/agendamento', (req, res) => {
  const { usuarioId, data, horario } = req.body;

  const query = 'INSERT INTO agendamentos (usuario_id, data, horario) VALUES (?, ?, ?)';
  db.query(query, [usuarioId, data, horario], (err, result) => {
    if (err) {
      console.error('Erro ao criar agendamento:', err);
      return res.status(500).send('Erro ao criar agendamento.');
    }

    res.status(201).send('Agendamento criado com sucesso!');
  });
});
// Endpoint para testar conexão com o banco de dados
app.get('/test-db', (req, res) => {
  db.query('SELECT 1', (err, result) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      return res.status(500).send('Erro ao conectar ao banco de dados.');
    }
    res.status(200).send('Conexão com o banco de dados está funcionando!');
  });
});
// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});