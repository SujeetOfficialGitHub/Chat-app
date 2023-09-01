const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./userModel')

const Message = sequelize.define('Message', {
    messageType: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      trim: true,
    },
});
  
Message.belongsTo(User, { 
    foreignKey: 'senderId',
    as: 'sender'
});

module.exports = Message