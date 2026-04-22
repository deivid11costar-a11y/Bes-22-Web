const db = require('../db');

exports.createTask = (req, res) => {
  const { title, description, deadline, priority, assigned_to } = req.body;
  
  // Algoritmo: Passo 4 - Sistema verifica se todos os campos obrigatórios estão preenchidos
  if (!title || !deadline || !priority || !assigned_to) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
  }

  // Algoritmo: Passo 7 - Persiste a tarefa
  const query = `INSERT INTO tasks (title, description, deadline, priority, assigned_to, status) VALUES (?, ?, ?, ?, ?, 'pending')`;
  
  db.run(query, [title, description, deadline, priority, assigned_to], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao criar a tarefa no banco.' });
    }
    res.status(201).json({ id: this.lastID, message: 'Tarefa criada com sucesso!' });
  });
};

exports.getTasks = (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar tarefas.' });
    res.json(rows);
  });
};

exports.updateTaskStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.run('UPDATE tasks SET status = ? WHERE id = ?', [status, id], function(err) {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
    res.json({ message: 'Status atualizado com sucesso.' });
  });
};
