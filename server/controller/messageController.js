const Message = require('../models/messageModel')
const User = require('../models/userModel')
const Chat = require('../models/chatModel')

const sendMessage = async(req, res) => {
    const {content, chatId} = req.body;
    console.log(content, chatId)
    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.status(400).json();
    }
    try {
        const newMessage = await Message.create({
            senderId: req.user.id, // Assuming senderId is the column name in the Message model
            content: content,
            chatId: chatId,
        });

        const message = await Message.findByPk(newMessage.id, {
            include: [
                { model: User, as: "sender", attributes: ["name"] },
            ],
        });

        // update latest message 
        await Chat.update({ latestMessageId: message.id }, { where: { id: chatId } });
        // Fetch chat information using a separate query
        const chat = await Chat.findByPk(chatId, {
            include: [
                { model: User, as: 'ChatUsers', attributes: { exclude: ['password'] } },
            ]
        });

        // Add chat information to the message JSON object
        const messageJson = message.toJSON();

        messageJson.chat = chat;
        res.status(200).json(messageJson);
    } catch (error) {
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
            attributes: ['id', "content", "createdAt"],
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