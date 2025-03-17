const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/config');

// Middleware per verificare il token JWT
const authenticate = async (req, res, next) => {
  try {
    // Ottieni il token dall'header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token di autenticazione non fornito' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verifica il token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Trova l'utente associato al token
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Utente non trovato' });
    }
    
    // Aggiungi l'utente alla richiesta
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token scaduto' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token non valido' });
    }
    
    console.error('Errore di autenticazione:', error);
    res.status(500).json({ message: 'Errore durante l\'autenticazione' });
  }
};

// Middleware per autorizzare solo gli amministratori
const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accesso non autorizzato' });
  }
  
  next();
};

module.exports = {
  authenticate,
  authorizeAdmin
}; 