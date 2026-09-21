const express = require('express')

const {
    createMessage,
    getMessages
} = require('../controllers/message-controller')

const authenticate = require('../middlewares/auth-middleware')

const router = express.Router()

router.use(authenticate)

router.post('/:conversationId', createMessage)

router.get('/:conversationId', getMessages)

module.exports = router