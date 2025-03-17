const { User } = require('../models');
const logger = require('../utils/logger');

const initAdminUser = async () => {
  try {
    // Verifica se l'utente admin esiste già
    const adminExists = await User.findOne({
      where: { 
        username: 'admin'
      }
    });
    
    if (!adminExists) {
      // Crea l'utente admin
      await User.create({
        username: 'admin',
        email: 'admin@waichat.local',
        password: 'admin',
        fullName: 'Administrator',
        role: 'admin'
      });
      
      logger.info('Utente admin creato con successo');
    } else {
      logger.info('Utente admin già esistente');
    }
  } catch (error) {
    logger.error('Errore durante la creazione dell\'utente admin:', error);
  }
};

module.exports = initAdminUser; 