const express = require('express');
const usersRoutes = require('./users');
const tasksRoutes = require('./tasks');

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/tasks', tasksRoutes);

module.exports = router;
