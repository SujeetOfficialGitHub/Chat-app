const User = require('../models/userModel')
const Chat = require('../models/chatModel')
const Message = require('../models/messageModel')
const {Op}  = require('sequelize');

const accessChat = async (req, res) => {
    const { userId } = req.body;
    console.log(userId)

    if (!userId) {
        console.log('User id not provided');
        return res.status(400).json({ message: "User id not provided" });
    }

    try {
        const chatUsers = [req.user.id, userId].sort();

        // Check if a chat exists between the two users
        let isChat = await Chat.findOne({
            where: {
                isGroupChat: false,
            },
            include: [
                {
                    model: User,
                    as: 'ChatUsers',
                    attributes: { exclude: ['password'] },
                    through: {
                        where: {
                            userId: {
                                [Op.in]: chatUsers,
                            },
                        },
                    },
                },
                { model: User, as: 'GroupAdmin', attributes: { exclude: ['password'] } },
                { model: Message, as: 'LatestMessage' },
            ],
        });
        console.log(isChat.toJSON())
        if (isChat && isChat.ChatUsers.length > 0){
            res.status(200).json(isChat)
        }else {
            // If chat doesn't exist, create a new one
            const chatData = {
                chatName: 'sender',
                isGroupChat: false,
            };
            isChat = await Chat.create(chatData);

            // Ensure that the chat is associated with the users
            await isChat.addChatUsers(chatUsers); // Use addChatUsers method to add associations
            // Now, fetch the chat with updated associations
            const FullChat = await Chat.findOne({
                where: { id: isChat.id },
                include: [
                    { model: User, as: 'ChatUsers', attributes: { exclude: ['password'] } },
                    { model: User, as: 'GroupAdmin', attributes: { exclude: ['password'] } },
                    { model: Message, as: 'LatestMessage' },
                ],
            });
    
            res.status(200).json(FullChat);
        }

    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
};


const fetchChats = async (req, res) => {
    try {
        const results = await Chat.findAll({
            where: {
                id: req.user.id
            },
            include: [
                { model: User, as: 'ChatUsers', attributes: { exclude: ['password'] } },
                { model: User, as: 'GroupAdmin', attributes: { exclude: ['password'] } },
                { model: Message, as: 'LatestMessage' },
            ],
            order: [['updatedAt', 'DESC']],
        });

        for (const chat of results) {
            if (chat.LatestMessage) {
                await chat.LatestMessage.reload({
                    include: [
                        { model: User, as: 'sender', attributes: ['name', 'pic', 'email'] },
                    ],
                });
            }
        }

        res.status(200).json(results);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    accessChat,
    fetchChats
}
