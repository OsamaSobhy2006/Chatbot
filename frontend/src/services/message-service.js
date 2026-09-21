import api from './api'

const getMessages = async (conversationId) => {

    const response = await api.get(
        `/messages/${conversationId}`
    )

    return response.data
}

const sendMessage = async (
    conversationId,
    content
) => {

    const response = await api.post(
        `/messages/${conversationId}`,
        {
            content
        }
    )

    return response.data
}

export default {
    getMessages,
    sendMessage
}