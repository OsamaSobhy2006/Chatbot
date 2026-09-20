const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const User = require('../models/User')


const generateToken = (userId) => {

    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}


const register = async ({ name, email, password }) => {

    if (!name || !email || !password) 
        throw new Error('All fields are required')
    

    name = name.trim()
    email = email.trim().toLowerCase()

    if (name.length < 3) 
        throw new Error('Name must be at least 3 characters')
    

    if (!validator.isEmail(email)) 
        throw new Error('Please provide a valid email')
    

    if (password.length < 6) 
        throw new Error('Password must be at least 6 characters')
    


    const existingUser = await User.findOne({ email })

    if (existingUser) 
        throw new Error('Email already exists')
    


    const hashedPassword = await bcrypt.hash(password, 12)


    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })


    const token = generateToken(user._id)


    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        token
    }
}


const login = async ({ email, password }) => {

    if (!email || !password) 
        throw new Error('Email and password are required')
    

    email = email.trim().toLowerCase()


    if (!validator.isEmail(email)) 
        throw new Error('Please provide a valid email')
    


    const user = await User.findOne({email})

    if (!user) 
        throw new Error('Invalid email or password')
    


    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) 
        throw new Error('Invalid email or password')
    


    const token = generateToken(user._id)


    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        token
    }
}


module.exports = {
    register,
    login
}