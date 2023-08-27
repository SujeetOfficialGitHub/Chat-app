const express = require('express');
const router = express.Router();

const {authMiddleware} = require('../middleware/authMiddleware')
const chatController = require('../controller/chatController')

router.use(authMiddleware);
router.post('/', chatController.accessChat)
router.get('/', chatController.fetchChats);
// router.get('/group', chatController.createGroupChat);
// router.get('/rename', chatController.renameGroup);
// router.get('/groupremove', chatController.removeFromGroup);
// router.get('/groupadd', chatController.addToGroup);

module.exports = router