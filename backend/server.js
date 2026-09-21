require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const http = require('http')
const { Server } = require('socket.io')

const connectDB = require('./config/database')

const authRouter = require('./routes/auth-route')
const conversationRouter = require('./routes/conversation-route')
const messageRouter = require('./routes/message-route')

connectDB()

const app = express()

app.use(helmet())

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true
    })
)

app.use(express.json())

app.use('/auth', authRouter)
app.use('/conversations', conversationRouter)
app.use('/messages', messageRouter)

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'DELETE'],
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)

    socket.on('join-conversation', (conversationId) => {
        socket.join(`conversation:${conversationId}`)

        console.log(`Socket ${socket.id} joined conversation ${conversationId}`)
    })

    socket.on('leave-conversation', (conversationId) => {
        socket.leave(`conversation:${conversationId}`)
    })

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id)
    })
})

app.set('io', io)

const PORT = process.env.PORT || 8000

server.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`)
})