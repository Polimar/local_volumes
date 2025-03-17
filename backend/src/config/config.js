require('dotenv').config();

module.exports = {
  development: {
    database: process.env.DB_NAME || 'waichat',
    username: process.env.DB_USER || 'waichat',
    password: process.env.DB_PASSWORD || 'strongpassword',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    database: process.env.DB_NAME || 'waichat',
    username: process.env.DB_USER || 'waichat',
    password: process.env.DB_PASSWORD || 'strongpassword',
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'yoursecretkey',
    expiresIn: '7d'
  },
  server: {
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || 'development'
  },
  ollama: {
    url: process.env.OLLAMA_URL || 'http://ollama:11434'
  }
}; 