import api from './api'

const getConversations = async () => {
    const response = await api.get('/conversations')
    return response.data
}

const createConversation = async (title) => {
    const response = await api.post('/conversations', {
        title
    })

    return response.data
}

const getConversation = async (id) => {
    const response = await api.get(
        `/conversations/${id}`
    )

    return response.data
}

const deleteConversation = async (id) => {
    const response = await api.delete(
        `/conversations/${id}`
    )

    return response.data
}

export default {
    getConversations,
    createConversation,
    getConversation,
    deleteConversation
}