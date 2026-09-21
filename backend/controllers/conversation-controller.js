const Conversation = require('../models/Conversation')
const Message = require('../models/Message')

const createConversation = async (req, res) => {

    try {
        const { title } = req.body

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Conversation title is required'
            })
        }

        const conversation = await Conversation.create({
            user: req.userId,
            title: title.trim()
        })

        return res.status(201).json({
            success: true,
            message: 'Conversation created successfully',
            data: conversation
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: 'Failed to create conversation'
        })
    }
}


const getConversations = async (req, res) => {

    try {
        const conversations = await Conversation.find({
            user: req.userId
        }).sort({
            updatedAt: -1
        })

        return res.status(200).json({
            success: true,
            data: conversations
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: 'Failed to get conversations'
        })
    }
}


const getConversation = async (req, res) => {

    try {

        const conversation = await Conversation.findOne({
            _id: req.params.id,
            user: req.userId
        })

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            })
        }

        return res.status(200).json({
            success: true,
            data: conversation
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: 'Failed to get conversation'
        })
    }
}


const deleteConversation = async (req, res) => {

    try {

        const conversation = await Conversation.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        })

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            })
        }

        await Message.deleteMany({
            conversation: conversation._id
        })

        return res.status(200).json({
            success: true,
            message: 'Conversation deleted successfully'
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: 'Failed to delete conversation'
        })
    }
}


module.exports = {
    createConversation,
    getConversations,
    getConversation,
    deleteConversation
}