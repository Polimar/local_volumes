const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');
const { sequelize, syncDatabase } = require('./models');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const config = require('./config/config');
const initAdminUser = require('./scripts/initAdmin');
const logger = require('./utils/logger');

// Inizializzazione dell'app Express
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 100, // limite di richieste per IP
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', apiLimiter);

// Route di base
app.get('/', (req, res) => {
  res.json({ message: 'WaiChat API' });
});

// Route API
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Gestione errori 404
app.use((req, res) => {
  res.status(404).json({ message: 'Risorsa non trovata' });
});

// Gestione errori globale
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(err.status || 500).json({
    message: err.message || 'Errore interno del server'
  });
});

// Configurazione Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // In produzione, limita agli URL consentiti
    methods: ['GET', 'POST']
  }
});

// Gestione eventi Socket.IO
io.on('connection', (socket) => {
  logger.info(`Utente connesso: ${socket.id}`);
  
  // Gestione degli eventi della chat
  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    logger.info(`L'utente ${socket.id} si è unito alla chat ${chatId}`);
  });
  
  socket.on('leave_chat', (chatId) => {
    socket.leave(chatId);
    logger.info(`L'utente ${socket.id} ha lasciato la chat ${chatId}`);
  });
  
  socket.on('send_message', (messageData) => {
    io.to(messageData.chatId).emit('receive_message', messageData);
  });
  
  socket.on('typing', (data) => {
    socket.to(data.chatId).emit('user_typing', data);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Utente disconnesso: ${socket.id}`);
  });
});

// Avvio del server
const PORT = config.server.port;

const startServer = async () => {
  try {
    // Sincronizzazione del database
    await syncDatabase(false);
    
    // Inizializzazione dell'utente admin
    await initAdminUser();
    
    // Avvio del server
    server.listen(PORT, () => {
      logger.info(`Server in esecuzione sulla porta ${PORT}`);
    });
  } catch (error) {
    logger.error('Errore durante l\'avvio del server:', error);
    process.exit(1);
  }
};

startServer(); 