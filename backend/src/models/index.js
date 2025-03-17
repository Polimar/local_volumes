const sequelize = require("../config/database");
const User = require("./User");
const Chat = require("./Chat");
const Message = require("./Message");
const ChatUser = require("./ChatUser");

// Definizione delle relazioni
User.belongsToMany(Chat, { through: ChatUser, foreignKey: "userId" });
Chat.belongsToMany(User, { through: ChatUser, foreignKey: "chatId" });

Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });
Message.belongsTo(Chat, { foreignKey: "chatId" });

Chat.hasMany(Message, { foreignKey: "chatId" });
User.hasMany(Message, { as: "sentMessages", foreignKey: "senderId" });

// Funzione per sincronizzare il database
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log("Database sincronizzato con successo");
  } catch (error) {
    console.error("Errore durante la sincronizzazione del database:", error);
  }
};

module.exports = {
  sequelize,
  User,
  Chat,
  Message,
  ChatUser,
  syncDatabase
};
