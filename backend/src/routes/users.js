const express = require('express');
const { body, param } = require('express-validator');
const ctrl = require('../controllers/userController');
const validate = require('../middleware/validate');

const router = express.Router();

const userBodyRules = [
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 chars'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 chars'),
  body('email').trim().isEmail().withMessage('Invalid email').normalizeEmail(),
  body('role').optional().isIn(['admin', 'manager', 'user']).withMessage('Invalid role'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
  body('phone').optional({ checkFalsy: true }).isLength({ max: 30 }),
  body('department').optional({ checkFalsy: true }).isLength({ max: 60 }),
];

const idRule = [param('id').isMongoId().withMessage('Invalid user id')];

router.get('/stats', ctrl.getStats);
router.get('/', ctrl.getUsers);
router.get('/:id', idRule, validate, ctrl.getUser);
router.post('/', userBodyRules, validate, ctrl.createUser);
router.put('/:id', [...idRule, ...userBodyRules], validate, ctrl.updateUser);
router.delete('/:id', idRule, validate, ctrl.deleteUser);

module.exports = router;
