const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');

// Registrazione
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Ottenere informazioni utente autenticato
router.get('/me', authMiddleware, authController.getMe);

// Logout
router.post('/logout', authMiddleware, authController.logout);

module.exports = router; 