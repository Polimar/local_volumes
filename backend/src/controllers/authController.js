const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/config');

// Registrazione utente
const register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    
    // Verifica se l'utente esiste già
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ username }, { email }] 
      } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username o email già in uso' });
    }
    
    // Crea nuovo utente
    const user = await User.create({
      username,
      email,
      password,
      fullName,
      role: 'user'
    });
    
    // Genera token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    res.status(500).json({ message: 'Errore durante la registrazione' });
  }
};

// Login utente
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Trova l'utente
    const user = await User.findOne({ 
      where: { 
        [Op.or]: [
          { username },
          { email: username } // Permette login con email o username
        ]
      } 
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    
    // Verifica password
    const isPasswordValid = await user.validatePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    
    // Aggiorna stato utente
    user.status = 'online';
    user.lastSeen = new Date();
    await user.save();
    
    // Genera token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
        status: user.status
      },
      token,
      redirectToAdmin: user.role === 'admin' // Flag per reindirizzamento al pannello admin
    });
  } catch (error) {
    console.error('Errore durante il login:', error);
    res.status(500).json({ message: 'Errore durante il login' });
  }
};

// Ottenere informazioni utente
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Errore durante il recupero delle informazioni utente:', error);
    res.status(500).json({ message: 'Errore durante il recupero delle informazioni utente' });
  }
};

// Logout utente
const logout = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (user) {
      user.status = 'offline';
      user.lastSeen = new Date();
      await user.save();
    }
    
    res.json({ message: 'Logout effettuato con successo' });
  } catch (error) {
    console.error('Errore durante il logout:', error);
    res.status(500).json({ message: 'Errore durante il logout' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout
}; 