const express = require('express');
const authController = require('./controllers/authController');
const taskController = require('./controllers/taskController');

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

router.post('/tasks', taskController.createTask);
router.get('/tasks', taskController.getTasks);
router.patch('/tasks/:id/status', taskController.updateTaskStatus);

module.exports = router;
