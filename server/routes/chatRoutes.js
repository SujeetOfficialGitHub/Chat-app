const express = require('express');
const router = express.Router();

const {authMiddleware} = require('../middleware/authMiddleware')
const chatController = require('../controller/chatController')

router.use(authMiddleware);
router.post('/', chatController.accessChat)
router.get('/', chatController.fetchChats);
router.post('/group', chatController.createGroupChat);
router.put('/rename', chatController.renameGroup);
router.put('/groupremove', chatController.removeFromGroup);
router.put('/groupadd', chatController.addToGroup);

module.exports = router