const express = require('express')
const router = express.Router();

const {authMiddleware} = require('../middleware/authMiddleware')


const userController = require('../controller/userController');
router.post('/signup', userController.signup)
router.post('/login', userController.login)

router.use(authMiddleware)
router.get('/', userController.allUsers)

module.exports  = router