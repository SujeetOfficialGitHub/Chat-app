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
const server = app.listen(PORT, () => {
    console.log(`Server runs at port ${PORT}`)
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})

 
io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData.id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => {
        console.log('typeing is stop')
        console.log('2222222222222222222')
        console.log('2222222222222222222')
        console.log('2222222222222222222')
        console.log('2222222222222222222')
        console.log('2222222222222222222')
        socket.in(room).emit("stop typing")
    });
//   
    socket.on("new message", (users, message) => {
        // console.log(message)
        // console.log(users)

      if (!users) return console.log("users not defined");
  
      users.forEach((user) => {
        if (user.id == message.sender.id) return;
        socket.in(user.id).emit("message received", message);
    });
    // io.to(message.chatId).emit("message received", message);
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData.id);
    });
});
  
