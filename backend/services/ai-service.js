const OpenAI = require('openai')

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
})

const generateResponseStream = async (messages, onChunk) => {
    const stream = await client.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || 'openrouter/free',

        messages: messages.map((message) => ({
            role: message.role,
            content: message.content
        })),

        stream: true
    })

    let fullResponse = ''

    for await (const chunk of stream) {
        const content = chunk.choices?.[0]?.delta?.content
        if (!content) 
            continue

        fullResponse += content

        onChunk(content)
    }

    return fullResponse
}

module.exports = {
    generateResponseStream
}