const express = require('express');
const tasksController = require('../controllers/tasks');
const validate = require('../middleware/validate');
const { taskRules } = require('../middleware/validators');
const { requireUser } = require('../middleware/auth');

const router = express.Router();

router.use(requireUser);

router.get('/', tasksController.getAll);
router.get('/:id', tasksController.getSingle);
router.post('/', taskRules, validate, tasksController.createTask);
router.put('/:id', taskRules, validate, tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

module.exports = router;
