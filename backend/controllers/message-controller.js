const Conversation = require('../models/Conversation')
const Message = require('../models/Message')
const aiService = require('../services/ai-service')

const createMessage = async (req, res) => {
    try {
        const { conversationId } = req.params
        const { content } = req.body

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Message content is required'
            })
        }

        const conversation = await Conversation.findOne({
            _id: conversationId,
            user: req.userId
        })

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            })
        }

        const userMessage = await Message.create({
            conversation: conversationId,
            role: 'user',
            content: content.trim()
        })

        const previousMessages = await Message.find({
            conversation: conversationId
        }).sort({ createdAt: 1 })

        const io = req.app.get('io')

        const room = `conversation:${conversationId}`

        io.to(room).emit('ai-typing', {
            conversationId,
            isTyping: true
        })

        const assistantContent =
            await aiService.generateResponseStream(
                previousMessages.map((message) => ({
                    role: message.role,
                    content: message.content
                })),

                (chunk) => {

                    io.to(room).emit(
                        'assistant-stream',
                        {
                            conversationId,
                            chunk
                        }
                    )
                }
            )

        const assistantMessage =
            await Message.create({
                conversation: conversationId,
                role: 'assistant',
                content: assistantContent
            })

        io.to(room).emit(
            'assistant-stream-end',
            {
                conversationId,
                message: assistantMessage
            }
        )

        io.to(room).emit('ai-typing', {
            conversationId,
            isTyping: false
        })

        await Conversation.findByIdAndUpdate(
            conversationId,
            {
                updatedAt: new Date()
            }
        )

        return res.status(201).json({
            success: true,
            data: {
                userMessage
            }
        })

    } catch (error) {
        console.error(
            'Create message error:',
            error
        )

        const io = req.app.get('io')

        const conversationId =
            req.params.conversationId

        io.to(
            `conversation:${conversationId}`
        ).emit('ai-typing', {
            conversationId,
            isTyping: false
        })

        io.to(
            `conversation:${conversationId}`
        ).emit('assistant-stream-error', {
            conversationId,
            message:
                error.message ||
                'Failed to generate AI response'
        })

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                'Failed to send message'
        })
    }
}


const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params

        const conversation = await Conversation.findOne({
            _id: conversationId,
            user: req.userId
        })

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            })
        }

        const messages = await Message.find({
            conversation: conversationId
        }).sort({ createdAt: 1 })

        return res.status(200).json({
            success: true,
            data: messages
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to get messages'
        })
    }
}


module.exports = {
    createMessage,
    getMessages
}