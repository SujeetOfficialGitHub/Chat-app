const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./userModel')
const Message = require('./messageModel')

const Chat = sequelize.define('chat', {
    chatName: {
        type: DataTypes.STRING,
        trim: true
    },
    isGroupChat: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

// Define the association between Chat and User for the 'ChatUsers' field
Chat.belongsToMany(User, {
  through: 'ChatUser',
  foreignKey: 'chatId',
  otherKey: 'userId',
  as: 'ChatUsers'
});

// Define the association between Chat and User for the 'groupAdmin' field
Chat.belongsTo(User, {
  foreignKey: 'groupAdmin',
  as: 'GroupAdmin'
});

// Define the association between Chat and Message for the 'latestMessage' field
Chat.belongsTo(Message, {
  foreignKey: 'latestMessageId',
  as: 'LatestMessage'
});

Chat.hasMany(Message, {
  foreignKey: 'chatId',
  as: 'Chat'
});

module.exports = Chat;
