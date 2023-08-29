const express = require('express')
const router = express.Router();

const {authMiddleware} = require('../middleware/authMiddleware')
const messageController = require('../controller/messageController')

router.use(authMiddleware);
router.post('', messageController.sendMessage)
router.get('/:chatId', messageController.allMessages)

module.exports = router;