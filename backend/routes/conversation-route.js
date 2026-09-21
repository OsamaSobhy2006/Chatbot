const express = require('express')

const {
    createConversation,
    getConversations,
    getConversation,
    deleteConversation
} = require('../controllers/conversation-controller')

const authenticate = require('../middlewares/auth-middleware')
const router = express.Router()

router.use(authenticate)

router.post('/', createConversation)

router.get('/', getConversations)

router.get('/:id', getConversation)

router.delete('/:id', deleteConversation)

module.exports = router