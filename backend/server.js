const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const connectDB = require('./config/database')
const authRouter = require('./routes/auth-route')

require('dotenv').config()

connectDB()

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use('/auth', authRouter)


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`)
})