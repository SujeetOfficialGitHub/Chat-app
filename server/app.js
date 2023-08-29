require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())

const sequelize = require('./util/database')
const User = require('./models/userModel')
const Chat = require('./models/chatModel')
const Message = require('./models/messageModel')

const cors = require('cors')
app.use(cors())

const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messagesRoutes = require('./routes/messageRoutes')
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messagesRoutes);

// sequelize.sync({force: true})
// (async () => {
//     await User.sync({ alter: true });
//     await Chat.sync({ alter: true });
//     await Message.sync({ alter: true });
  
//     console.log('Models synchronized without dropping tables.');
// })();


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server runs at port ${PORT}`)
})


