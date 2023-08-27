const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./userModel')
const Chat = require('./chatModel')

const Message = sequelize.define('message', {
    sender: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    content: {
        type: DataTypes.STRING,
        trim: true
    },
    // chat: {
    //     type: DataTypes.INTEGER,
    //     references: {
    //         model: Chat,
    //         key: 'id'
    //     }
    // }
    
})

module.exports = Message