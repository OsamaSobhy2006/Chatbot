const express = require('express')

const {register, login, getCurrentUser} = require('../controllers/auth-controller')
const authenticate = require('../middlewares/auth-middleware')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)


module.exports = router