const express = require('express');
const cors = require('cors');
const db = require('./db');
const apiRoutes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

// Rota inicial
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
