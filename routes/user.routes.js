const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getAllUsers);
router.get('/:email', userController.getUserByEmail);
router.post('/', userController.createUser);
router.patch('/:email', userController.updateUser);
router.delete('/:email', userController.deleteUser);
router.get('/role/:email', userController.getUserRole);

module.exports = router; 