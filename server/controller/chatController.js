const User = require('../models/userModel')
const Chat = require('../models/chatModel')
const Message = require('../models/messageModel')
const {Op, sequelize} = require('sequelize')

const accessChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User id not provided" });
    }

    try {
        const loggedInUserId = req.user.id;

        // Check if a chat exists between the two users
        const isChat = await Chat.findOne({
            where: {
                isGroupChat: false,
            },
            include: [
                {
                    model: User,
                    as: 'ChatUsers',
                    attributes: ['id'],
                },
                { model: Message, as: 'LatestMessage' },
            ],
        });

        const usersInChat = isChat ? isChat.ChatUsers.map(user => user.id) : [];

        // If chat doesn't exist or both users are not part of it, create a new chat
        if (!isChat || !usersInChat.includes(loggedInUserId) || !usersInChat.includes(userId)) {
            const chatData = {
                chatName: 'sender',
                isGroupChat: false,
            };

            const createdChat = await Chat.create(chatData);

            // Ensure that the chat is associated with the users
            await createdChat.addChatUsers([loggedInUserId, userId]);

            // Now, fetch the chat with updated associations
            const fullChat = await Chat.findOne({
                where: { id: createdChat.id },
                include: [
                    { model: User, as: 'ChatUsers', attributes: { exclude: ['password'] } },
                    { model: Message, as: 'LatestMessage' },
                ],
            });

            return res.status(200).json(fullChat);
        }

        return res.status(200).json(isChat);

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ message: "An error occurred" });
    }
};



const fetchChats = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;

        const chats = await Chat.findAll({
            where: {
                [Op.or]: [
                    { groupAdmin: loggedInUserId },
                    { '$ChatUsers.id$': loggedInUserId },
                ],
            },
            include: [
                { 
                    model: User, 
                    as: 'ChatUsers',
                    attributes: { exclude: ['password'] },
                },
                { 
                    model: User, 
                    as: 'GroupAdmin',
                    attributes: { exclude: ['password'] },
                },
                { model: Message, as: 'LatestMessage' },
            ],
            order: [['updatedAt', 'DESC']],
        });

        const results = await Promise.all(chats.map(async chat => {
            const fullChat = chat.toJSON();
            if (fullChat.LatestMessage) {
                await fullChat.LatestMessage.reload({
                    include: [
                        { model: User, as: 'sender', attributes: ['name', 'email'] },
                    ],
                });
            }
            const chatUsers = await chat.getChatUsers({ attributes: ['id', 'name', 'email'] });
            fullChat.ChatUsers = chatUsers;
            return fullChat;
        }));

        res.status(200).json(results);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
};

const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the fields" });
    }

    const users = JSON.parse(req.body.users);

    if (users.length < 1) {
        return res.status(400).send("Minimum 2 users are required to form a group chat");
    }

    users.push(req.user.id); // Add the ID of the logged-in user

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            groupAdmin: req.user.id,
        });

        await groupChat.addChatUsers(users); // Associate user IDs with the group chat

        const fullGroupChat = await Chat.findOne({
            where: { id: groupChat.id },
            include: [
                { model: User, as: 'ChatUsers', attributes: { exclude: ['password'] } },
                { model: User, as: 'GroupAdmin', attributes: { exclude: ['password'] } },
            ],
        });
        // console.log(fullGroupChat.toJSON())
        res.status(200).json(fullGroupChat);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
};
const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;
    try {
        const [affectedRows] = await Chat.update(
            { chatName: chatName },
            { where: { id: chatId } }
        );
    
        if (affectedRows === 0) {
            res.status(404).json({ message: "Chat Not Found" });
        } else {
            const updatedChat = await Chat.findByPk(chatId, {
                include: [
                    { model: User, as: 'ChatUsers', attributes: { exclude: ['password'] } },
                    { model: User, as: 'GroupAdmin', attributes: { exclude: ['password'] } },
                ],
            });
    
            res.status(200).json(updatedChat);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "An error occurred while updating chat." });
    }
} 



const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;
    console.log(chatId, userId)

    try {
        // Check if the requester is the admin of the group chat
        const chat = await Chat.findOne({
            where: { id: chatId, groupAdmin: req.user.id },
        });

        if (!chat) {
            res.status(404);
            throw new Error("Chat Not Found or Requester is not the admin");
        }

        // Remove the user from the group chat
        await chat.removeChatUsers(userId);

        // Fetch the updated chat with users and admin
        const updatedChat = await Chat.findOne({
            where: { id: chatId },
            include: [
                { model: User, as: 'ChatUsers', attributes: { exclude: ['password'] } },
                { model: User, as: 'GroupAdmin', attributes: { exclude: ['password'] } },
            ],
        });

        res.json(updatedChat);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: error.message });
    }
};


const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        // Check if the requester is the admin of the group chat
        const chat = await Chat.findOne({
            where: { id: chatId, groupAdmin: req.user.id },
        });

        if (!chat) {
            res.status(404);
            throw new Error("Chat Not Found or Requester is not the admin");
        }

        // Add the user to the group chat
        await chat.addChatUser(userId);

        // Fetch the updated chat with users and admin
        const updatedChat = await Chat.findOne({
            where: { id: chatId },
            include: [
                { model: User, as: 'ChatUsers', attributes: { exclude: ['password'] } },
                { model: User, as: 'GroupAdmin', attributes: { exclude: ['password'] } },
            ],
        });

        res.json(updatedChat);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    removeFromGroup,
    addToGroup
}
