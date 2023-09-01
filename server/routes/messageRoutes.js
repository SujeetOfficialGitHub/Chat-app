const express = require('express')
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
  
const upload = multer({ storage: storage })

const {authMiddleware} = require('../middleware/authMiddleware')
const messageController = require('../controller/messageController')

router.use(authMiddleware);
router.post('/upload', upload.single('file'), messageController.uploadFile)
router.post('/', messageController.sendMessage)
router.get('/:chatId', messageController.allMessages)

module.exports = router;