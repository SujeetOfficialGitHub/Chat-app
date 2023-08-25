require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())

const sequelize = require('./util/database')

const cors = require('cors')
app.use(cors())

const userRoutes = require('./routes/userRoutes')
app.use('/api/user/', userRoutes)

// sequelize.sync({force: true})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server runs at port ${PORT}`)
})


