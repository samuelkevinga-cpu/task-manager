const { body } = require('express-validator');

const userRules = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('firstName is required'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('lastName is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('email must be valid'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('role must be user or admin')
];

const taskRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('title is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('description is required'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('status must be pending, in-progress, or completed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('priority must be low, medium, or high'),
  body('dueDate')
    .notEmpty()
    .withMessage('dueDate is required')
    .isISO8601()
    .withMessage('dueDate must be a valid date (ISO 8601)'),
  body('userId')
    .optional()
    .isMongoId()
    .withMessage('userId must be a valid MongoDB id'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('completed must be a boolean')
];

module.exports = {
  userRules,
  taskRules
};
