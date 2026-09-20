import api from './api'

const register = async(userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
}

const login = async(credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
}

const getCurrentUser = async() => {
    const response = await api.post('/auth/me')
    return response.data
}

export default {
    register,
    login, 
    getCurrentUser
}