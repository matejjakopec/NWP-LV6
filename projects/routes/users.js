const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/register', userController.getRegisterForm);
router.post('/register', userController.registerUser);

router.get('/login', userController.getLoginForm);
router.post('/login', userController.loginUser);

router.get('/logout', userController.logoutUser);

module.exports = router;