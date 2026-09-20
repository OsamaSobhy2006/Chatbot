const authService = require('../services/auth-service')


const register = async (req, res) => {

    try {
        const { name, email, password } = req.body

        const result = await authService.register({
            name,
            email,
            password
        })

        return res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: result
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


const login = async (req, res) => {

    try {
        const { email, password } = req.body

        const result = await authService.login({
            email,
            password
        })

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        })

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {
    register,
    login
}