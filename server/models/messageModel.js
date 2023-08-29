const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./userModel')
const Chat = require('./chatModel')

const Message = sequelize.define('Message', {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
});
  
Message.belongsTo(User, { 
    foreignKey: 'senderId',
    as: 'sender'
});

module.exports = Message