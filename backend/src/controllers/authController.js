const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'task_manager_secret_key_mock';

// Registrar um mock usuário para propósitos de teste depois
exports.register = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios.' });

  const hashedPassword = bcrypt.hashSync(password, 8);
  db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
    if (err) return res.status(500).json({ error: 'Erro ao registrar usuário' });
    res.json({ id: this.lastID, email });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Preencha email e senha.' });

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor' });
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Senha inválida' });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '8h' });
    res.json({ message: 'Login bem sucedido', token, user: { id: user.id, email: user.email } });
  });
};

// Seed de usuário inicial pra não precisar ficar criando o tempo todo
const seedUser = () => {
    const hashedPassword = bcrypt.hashSync("123456", 8);
    db.get('SELECT * FROM users WHERE email = ?', ['admin@email.com'], (err, user) => {
        if (!user) {
            db.run('INSERT INTO users (email, password) VALUES (?, ?)', ['admin@email.com', hashedPassword]);
        }
    });
}
setTimeout(seedUser, 1000);
