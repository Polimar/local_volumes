const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

// Middleware per proteggere tutte le routes admin
router.use(authenticate);
router.use(authorizeAdmin);

// Gestione utenti
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.put('/users/:id/password', adminController.changeUserPassword);
router.delete('/users/:id', adminController.deleteUser);

// Gestione modelli Ollama
router.get('/ollama/models', adminController.getAllOllamaModels);
router.post('/ollama/models', adminController.createOllamaModel);
router.get('/ollama/models/:id', adminController.getOllamaModelById);
router.put('/ollama/models/:id', adminController.updateOllamaModel);
router.delete('/ollama/models/:id', adminController.deleteOllamaModel);

// Gestione prompt Ollama
router.get('/ollama/prompts', adminController.getAllOllamaPrompts);
router.post('/ollama/prompts', adminController.createOllamaPrompt);
router.get('/ollama/prompts/:id', adminController.getOllamaPromptById);
router.put('/ollama/prompts/:id', adminController.updateOllamaPrompt);
router.delete('/ollama/prompts/:id', adminController.deleteOllamaPrompt);

// Gestione gruppi
router.get('/groups', adminController.getAllGroups);
router.post('/groups', adminController.createGroup);
router.get('/groups/:id', adminController.getGroupById);
router.put('/groups/:id', adminController.updateGroup);
router.delete('/groups/:id', adminController.deleteGroup);

// Gestione SSL
router.get('/ssl', adminController.getSSLCertificate);
router.post('/ssl', adminController.updateSSLCertificate);

module.exports = router; 