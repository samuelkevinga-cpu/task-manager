const express = require('express');
const usersController = require('../controllers/users');
const validate = require('../middleware/validate');
const { userRules } = require('../middleware/validators');
const { requireUser, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', usersController.getAll);
router.get('/:id', usersController.getSingle);
router.post('/', userRules, validate, usersController.createUser);
router.put('/:id', userRules, validate, usersController.updateUser);
router.delete('/:id', requireUser, requireAdmin, usersController.deleteUser);

module.exports = router;
