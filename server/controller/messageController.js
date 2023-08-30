const Message = require('../models/messageModel')
const User = require('../models/userModel')
const Chat = require('../models/chatModel')
const sequelize = require('../util/database')


const sendMessage = async(req, res) => {
    const {content, chatId} = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.status(400).json();
    }
    const transaction = await sequelize.transaction();
    try {
        const newMessage = await Message.create({
            senderId: req.user.id, // Assuming senderId is the column name in the Message model
            content: content,
            chatId: chatId,
        }, {transaction});


        // update latest message 
        await Chat.update({ latestMessageId: newMessage.id }, { where: { id: chatId }, transaction });
        
        await transaction.commit();
        // Fetch chat information using a separate query
        const message = await Message.findByPk(newMessage.id, {
            include: [
                {
                    model: User,
                    as: "sender",
                    attributes: ['id', "name", "email"],
                },
            ],
            attributes: ['id',"chatId", "content", "createdAt"],
            order: [["createdAt", "ASC"]],
        });

        // console.log(message.toJSON())
        res.status(200).json(message);
    } catch (error) {
        await transaction.rollback();
        console.log(error.message)
      res.status(400).json({ error: error.message });
    }
  };


  const allMessages = async (req, res) => {
    try {
        const chatId = req.params.chatId;

        // Fetch messages associated with the specified chat
        const messages = await Message.findAll({
            where: { chatId },
            include: [
                {
                    model: User,
                    as: "sender",
                    attributes: ['id', "name", "email"],
                },
            ],
            attributes: ['id',"ChatId", "content", "createdAt"],
            order: [["createdAt", "ASC"]],
        });

        res.json(messages);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};





  
module.exports = {
    sendMessage,
    allMessages
}