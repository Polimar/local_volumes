const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
const { User, Chat, ChatUser, Message } = require('../models');
const logger = require('../utils/logger');

// Modelli per Ollama (temporaneamente definiti come tabelle separate)
let ollamaModels = [];
let ollamaPrompts = [];
let nextModelId = 1;
let nextPromptId = 1;

// Gestione Utenti
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(users);
  } catch (error) {
    logger.error('Errore nel recupero degli utenti:', error);
    res.status(500).json({ message: 'Errore nel recupero degli utenti' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    res.json(user);
  } catch (error) {
    logger.error(`Errore nel recupero dell'utente ${req.params.id}:`, error);
    res.status(500).json({ message: 'Errore nel recupero dell\'utente' });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;
    
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
      role: role || 'user'
    });
    
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    });
  } catch (error) {
    logger.error('Errore nella creazione dell\'utente:', error);
    res.status(500).json({ message: 'Errore nella creazione dell\'utente' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email, fullName, role } = req.body;
    const userId = req.params.id;
    
    // Verifica se l'utente esiste
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    // Verifica se username o email sono già in uso da altri utenti
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({
        where: {
          username,
          id: { [Op.ne]: userId }
        }
      });
      
      if (usernameExists) {
        return res.status(400).json({ message: 'Username già in uso' });
      }
    }
    
    if (email && email !== user.email) {
      const emailExists = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: userId }
        }
      });
      
      if (emailExists) {
        return res.status(400).json({ message: 'Email già in uso' });
      }
    }
    
    // Aggiorna l'utente
    await user.update({
      username: username || user.username,
      email: email || user.email,
      fullName: fullName !== undefined ? fullName : user.fullName,
      role: role || user.role
    });
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    });
  } catch (error) {
    logger.error(`Errore nell'aggiornamento dell'utente ${req.params.id}:`, error);
    res.status(500).json({ message: 'Errore nell\'aggiornamento dell\'utente' });
  }
};

const changeUserPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.params.id;
    
    if (!password) {
      return res.status(400).json({ message: 'Password richiesta' });
    }
    
    // Verifica se l'utente esiste
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    // Hash della nuova password e aggiornamento
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    await user.update({ password: hashedPassword });
    
    res.json({ message: 'Password aggiornata con successo' });
  } catch (error) {
    logger.error(`Errore nell'aggiornamento della password per l'utente ${req.params.id}:`, error);
    res.status(500).json({ message: 'Errore nell\'aggiornamento della password' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Verifica se l'utente esiste
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    // Elimina l'utente
    await user.destroy();
    
    res.json({ message: 'Utente eliminato con successo' });
  } catch (error) {
    logger.error(`Errore nell'eliminazione dell'utente ${req.params.id}:`, error);
    res.status(500).json({ message: 'Errore nell\'eliminazione dell\'utente' });
  }
};

// Gestione modelli Ollama
const getAllOllamaModels = async (req, res) => {
  try {
    res.json(ollamaModels);
  } catch (error) {
    logger.error('Errore nel recupero dei modelli Ollama:', error);
    res.status(500).json({ message: 'Errore nel recupero dei modelli Ollama' });
  }
};

const getOllamaModelById = async (req, res) => {
  try {
    const model = ollamaModels.find(m => m.id === parseInt(req.params.id));
    
    if (!model) {
      return res.status(404).json({ message: 'Modello non trovato' });
    }
    
    res.json(model);
  } catch (error) {
    logger.error(`Errore nel recupero del modello Ollama ${req.params.id}:`, error);
    res.status(500).json({ message: 'Errore nel recupero del modello Ollama' });
  }
};

const createOllamaModel = async (req, res) => {
  try {
    const { name, url } = req.body;
    
    if (!name || !url) {
      return res.status(400).json({ message: 'Nome e URL richiesti' });
    }
    
    const newModel = {
      id: nextModelId++,
      name,
      url,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    ollamaModels.push(newModel);
    
    res.status(201).json(newModel);
  } catch (error) {
    logger.error('Errore nella creazione del modello Ollama:', error);
    res.status(500).json({ message: 'Errore nella creazione del modello Ollama' });
  }
};

const updateOllamaModel = async (req, res) => {
  try {
    const { name, url } = req.body;
    const modelId = parseInt(req.params.id);
    
    const modelIndex = ollamaModels.findIndex(m => m.id === modelId);
    
    if (modelIndex === -1) {
      return res.status(404).json({ message: 'Modello non trovato' });
    }
    
    ollamaModels[modelIndex] = {
      ...ollamaModels[modelIndex],
      name: name || ollamaModels[modelIndex].name,
      url: url || ollamaModels[modelIndex].url,
      updatedAt: new Date()
    };
    
    res.json(ollamaModels[modelIndex]);
  } catch (error) {
    logger.error(`Errore nell'aggiornamento del modello Ollama ${req.params.id}:`, error);
    res.status(500).json({ message: 'Errore nell\'aggiornamento del modello Ollama' });
  }
};

const deleteOllamaModel = async (req, res) => {
  try {
    const modelId = parseInt(req.params.id);
    const modelIndex = ollamaModels.findIndex(m => m.id === modelId);
    
    if (modelIndex === -1) {
      return res.status(404).json({ message: 'Modello non trovato' });
    }
    
    // Controlla se ci sono prompt che utilizzano questo modello
    const promptsUsingModel = ollamaPrompts.some(p => p.modelId === modelId);
    
    if (promptsUsingModel) {
      return res.status(400).json({ 
        message: 'Impossibile eliminare il modello perché è utilizzato da uno o più prompt' 
      });
    }
    
    ollamaModels.splice(modelIndex, 1);
    
    res.json({ message: 'Modello eliminato con successo' });
  } catch (error) {
    logger.error(`Errore nell'eliminazione del modello Ollama ${req.params.id}:`, error);
    res.status(500).json({ message: 'Errore nell\'eliminazione del modello Ollama' });
  }
};

// Gestione prompt Ollama
const getAllOllamaPrompts = async (req, res) => {
  try {
    res.json(ollamaPrompts);
  } catch (error) {
    logger.error('Errore nel recupero dei prompt Ollama:', error);
    res.status(500).json({ message: 'Errore nel recupero dei prompt Ollama' });
  }
};

const getOllamaPromptById = async (req, res) => {
  try {
    const prompt = ollamaPrompts.find(p => p.id === parseInt(req.params.id));
    
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt non trovato' });
    }
    
    res.json(prompt);
  } catch (error) {
    logger.error(`Errore nel recupero del prompt Ollama ${req.params.id}:`, error);
    res.status(500).json({ message: 'Errore nel recupero del prompt Ollama' });
  }
};

const createOllamaPrompt = async (req, res) => {
  try {
    const { name, content, modelId } = req.body;
    
    if (!name || !content || !modelId) {
      return res.status(400).json({ message: 'Nome, contenuto e ID modello richiesti' });
    }
    
    // Verifica che il modello esista
    const modelExists = ollamaModels.some(m => m.id === parseInt(modelId));
    
    if (!modelExists) {
      return res.status(400).json({ message: 'Modello non trovato' });
    }
    
    const newPrompt = {
      id: nextPromptId++,
      name,
      content,
      modelId: parseInt(modelId),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    ollamaPrompts.push(newPrompt);
    
    res.status(201).json(newPrompt);
  } catch (error) {
    logger.error('Errore nella creazione del prompt Ollama:', error);
    res.status(500).json({ message: 'Errore nella creazione del prompt Ollama' });
  }
};

const updateOllamaPrompt = async (req, res) => {
  try {
    const { name, content, modelId } = req.body;
    const promptId = parseInt(req.params.id);
    
    const promptIndex = ollamaPrompts.findIndex(p => p.id === promptId);
    
    if (promptIndex === -1) {
      return res.status(404).json({ message: 'Prompt non trovato' });
    }
    
    // Se viene fornito un nuovo modelId, verifica che esista
    if (modelId) {
      const modelExists = ollamaModels.some(m => m.id === parseInt(modelId));
      
      if (!modelExists) {
        return res.status(400).json({ message: 'Modello non trovato' });
      }
    }
    
    ollamaPrompts[promptIndex] = {
      ...ollamaPrompts[promptIndex],
      name: name || ollamaPrompts[promptIndex].name,
      content: content || ollamaPrompts[promptIndex].content,
      modelId: modelId ? parseInt(modelId) : ollamaPrompts[promptIndex].modelId,
      updatedAt: new Date()
    };
    
    res.json(ollamaPrompts[promptIndex]);
  } catch (error) {
    logger.error(`Errore nell'aggiornamento del prompt Ollama ${req.params.id}:`, error);
    res.status(500).json({ message: 'Errore nell\'aggiornamento del prompt Ollama' });
  }
};

const deleteOllamaPrompt = async (req, res) => {
  try {
    const promptId = parseInt(req.params.id);
    const promptIndex = ollamaPrompts.findIndex(p => p.id === promptId);
    
    if (promptIndex === -1) {
      return res.status(404).json({ message: 'Prompt non trovato' });
    }
    
    ollamaPrompts.splice(promptIndex, 1);
    
    res.json({ message: 'Prompt eliminato con successo' });
  } catch (error) {
    logger.error(`Errore nell'eliminazione del prompt Ollama ${req.params.id}:`, error);
    res.status(500).json({ message: 'Errore nell\'eliminazione del prompt Ollama' });
  }
};

// Gestione gruppi
const getAllGroups = async (req, res) => {
  try {
    const groups = await Chat.findAll({
      where: { isGroup: true },
      include: [{
        model: User,
        through: ChatUser,
        attributes: ['id', 'username', 'fullName', 'email']
      }]
    });
    
    res.json(groups);
  } catch (error) {
    logger.error('Errore nel recupero dei gruppi:', error);
    res.status(500).json({ message: 'Errore nel recupero dei gruppi' });
  }
};

const getGroupById = async (req, res) => {
  try {
    const group = await Chat.findOne({
      where: { 
        id: req.params.id,
        isGroup: true 
      },
      include: [{
        model: User,
        through: ChatUser,
        attributes: ['id', 'username', 'fullName', 'email']
      }]
    });
    
    if (!group) {
      return res.status(404).json({ message: 'Gruppo non trovato' });
    }
    
    res.json(group);
  } catch (error) {
    logger.error(`Errore nel recupero del gruppo ${req.params.id}:`, error);
    res.status(500).json({ message: 'Errore nel recupero del gruppo' });
  }
};

const createGroup = async (req, res) => {
  try {
    const { name, userIds } = req.body;
    
    if (!name || !userIds || !userIds.length) {
      return res.status(400).json({ message: 'Nome e almeno un utente richiesti' });
    }
    
    // Crea il gruppo
    const group = await Chat.create({
      name,
      isGroup: true
    });
    
    // Aggiungi gli utenti al gruppo
    const chatUsers = userIds.map(userId => ({
      chatId: group.id,
      userId
    }));
    
    await ChatUser.bulkCreate(chatUsers);
    
    // Carica il gruppo con gli utenti
    const createdGroup = await Chat.findByPk(group.id, {
      include: [{
        model: User,
        through: ChatUser,
        attributes: ['id', 'username', 'fullName', 'email']
      }]
    });
    
    res.status(201).json(createdGroup);
  } catch (error) {
    logger.error('Errore nella creazione del gruppo:', error);
    res.status(500).json({ message: 'Errore nella creazione del gruppo' });
  }
};

const updateGroup = async (req, res) => {
  try {
    const { name, userIds } = req.body;
    const groupId = req.params.id;
    
    // Verifica se il gruppo esiste
    const group = await Chat.findOne({
      where: { 
        id: groupId,
        isGroup: true 
      }
    });
    
    if (!group) {
      return res.status(404).json({ message: 'Gruppo non trovato' });
    }
    
    // Aggiorna il nome del gruppo se fornito
    if (name) {
      await group.update({ name });
    }
    
    // Aggiorna gli utenti del gruppo se forniti
    if (userIds && userIds.length) {
      // Rimuovi tutti gli utenti correnti
      await ChatUser.destroy({
        where: { chatId: groupId }
      });
      
      // Aggiungi i nuovi utenti
      const chatUsers = userIds.map(userId => ({
        chatId: groupId,
        userId
      }));
      
      await ChatUser.bulkCreate(chatUsers);
    }
    
    // Carica il gruppo aggiornato con gli utenti
    const updatedGroup = await Chat.findByPk(groupId, {
      include: [{
        model: User,
        through: ChatUser,
        attributes: ['id', 'username', 'fullName', 'email']
      }]
    });
    
    res.json(updatedGroup);
  } catch (error) {
    logger.error(`Errore nell'aggiornamento del gruppo ${req.params.id}:`, error);
    res.status(500).json({ message: 'Errore nell\'aggiornamento del gruppo' });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    
    // Verifica se il gruppo esiste
    const group = await Chat.findOne({
      where: { 
        id: groupId,
        isGroup: true 
      }
    });
    
    if (!group) {
      return res.status(404).json({ message: 'Gruppo non trovato' });
    }
    
    // Elimina tutti i messaggi del gruppo
    await Message.destroy({
      where: { chatId: groupId }
    });
    
    // Elimina tutte le relazioni utente-gruppo
    await ChatUser.destroy({
      where: { chatId: groupId }
    });
    
    // Elimina il gruppo
    await group.destroy();
    
    res.json({ message: 'Gruppo eliminato con successo' });
  } catch (error) {
    logger.error(`Errore nell'eliminazione del gruppo ${req.params.id}:`, error);
    res.status(500).json({ message: 'Errore nell\'eliminazione del gruppo' });
  }
};

// Gestione SSL
const getSSLCertificate = async (req, res) => {
  try {
    const certPath = path.join('/etc/nginx/certs/cert.pem');
    const keyPath = path.join('/etc/nginx/certs/key.pem');
    
    let cert = '';
    let key = '';
    
    try {
      cert = await fs.readFile(certPath, 'utf8');
      key = await fs.readFile(keyPath, 'utf8');
    } catch (err) {
      logger.warn('Certificati SSL non trovati o inaccessibili:', err);
    }
    
    res.json({ cert, key });
  } catch (error) {
    logger.error('Errore nel recupero dei certificati SSL:', error);
    res.status(500).json({ message: 'Errore nel recupero dei certificati SSL' });
  }
};

const updateSSLCertificate = async (req, res) => {
  try {
    const { cert, key } = req.body;
    
    if (!cert || !key) {
      return res.status(400).json({ message: 'Certificato e chiave richiesti' });
    }
    
    const certPath = path.join('/etc/nginx/certs/cert.pem');
    const keyPath = path.join('/etc/nginx/certs/key.pem');
    
    try {
      await fs.writeFile(certPath, cert);
      await fs.writeFile(keyPath, key);
    } catch (err) {
      logger.error('Errore nella scrittura dei certificati SSL:', err);
      return res.status(500).json({ 
        message: 'Errore nella scrittura dei certificati SSL. Verifica i permessi.' 
      });
    }
    
    res.json({ message: 'Certificati SSL aggiornati con successo' });
  } catch (error) {
    logger.error('Errore nell\'aggiornamento dei certificati SSL:', error);
    res.status(500).json({ message: 'Errore nell\'aggiornamento dei certificati SSL' });
  }
};

module.exports = {
  // Utenti
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  changeUserPassword,
  deleteUser,
  
  // Modelli Ollama
  getAllOllamaModels,
  getOllamaModelById,
  createOllamaModel,
  updateOllamaModel,
  deleteOllamaModel,
  
  // Prompt Ollama
  getAllOllamaPrompts,
  getOllamaPromptById,
  createOllamaPrompt,
  updateOllamaPrompt,
  deleteOllamaPrompt,
  
  // Gruppi
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  
  // SSL
  getSSLCertificate,
  updateSSLCertificate
}; 