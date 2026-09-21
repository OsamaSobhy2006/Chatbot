import { useEffect, useRef, useState } from 'react'

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { useAuth } from '../context/AuthContext'

import conversationService from '../services/conversation-service'
import messageService from '../services/message-service'
import socket from '../services/socket'

import './Chat.css'


function Chat() {

    const { user, logout } = useAuth()

    const [conversations, setConversations] = useState([])
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const messagesContainerRef = useRef(null)
    const selectedConversationRef = useRef(null)

    useEffect(() => {
        if (messagesContainerRef.current) {
            requestAnimationFrame(() => {
                messagesContainerRef.current.scrollTop =
                    messagesContainerRef.current.scrollHeight
            })
        }
    }, [messages, loading])

    useEffect(() => {

        const handleTyping = ({
            conversationId,
            isTyping
        }) => {
            const currentConversation =
                selectedConversationRef.current
            if (
                !currentConversation ||
                currentConversation._id !== conversationId
            ) {
                return
            }
            setLoading(isTyping)
        }

        const handleAssistantStream = ({
            conversationId,
            chunk
        }) => {

            const currentConversation =
                selectedConversationRef.current
            if (
                !currentConversation ||
                currentConversation._id !== conversationId
            ) 
                return

            setLoading(false)

            setMessages((prev) => {
                const existingAssistantMessage =
                    prev.find(
                        (item) =>
                            item._id ===
                            'streaming-assistant'
                    )

                if (!existingAssistantMessage) {
                    return [
                        ...prev,
                        {
                            _id: 'streaming-assistant',
                            role: 'assistant',
                            content: chunk,
                            isStreaming: true
                        }
                    ]
                }

                return prev.map((item) => {

                    if (
                        item._id !==
                        'streaming-assistant'
                    ) 
                        return item
                    
                    return {
                        ...item,

                        content:
                            item.content + chunk
                    }
                })
            })
        }
        const handleAssistantStreamEnd = ({
            conversationId,
            message
        }) => {

            const currentConversation =
                selectedConversationRef.current
            if (
                !currentConversation ||
                currentConversation._id !== conversationId
            ) 
                return
            
            setMessages((prev) =>
                prev.map((item) => {
                    if (
                        item._id !==
                        'streaming-assistant'
                    ) 
                        return item

                    return {
                        ...message,
                        isStreaming: false
                    }
                })
            )
            setLoading(false)
        }

        const handleAssistantStreamError = ({
            conversationId,
            message
        }) => {
            const currentConversation =
                selectedConversationRef.current

            if (
                !currentConversation ||
                currentConversation._id !== conversationId
            ) 
                return

            console.error(
                'AI streaming error:',
                message
            )

            setMessages((prev) =>
                prev.filter(
                    (item) =>
                        item._id !==
                        'streaming-assistant'
                )
            )
            setLoading(false)
        }

        socket.on(
            'ai-typing',
            handleTyping
        )

        socket.on(
            'assistant-stream',
            handleAssistantStream
        )

        socket.on(
            'assistant-stream-end',
            handleAssistantStreamEnd
        )

        socket.on(
            'assistant-stream-error',
            handleAssistantStreamError
        )

        return () => {
            socket.off(
                'ai-typing',
                handleTyping
            )

            socket.off(
                'assistant-stream',
                handleAssistantStream
            )

            socket.off(
                'assistant-stream-end',
                handleAssistantStreamEnd
            )

            socket.off(
                'assistant-stream-error',
                handleAssistantStreamError
            )
        }
    }, [])

    useEffect(() => {
        if (!selectedConversation?._id) 
            return

        selectedConversationRef.current =
            selectedConversation

        socket.emit(
            'join-conversation',
            selectedConversation._id
        )

        return () => {
            socket.emit(
                'leave-conversation',
                selectedConversation._id
            )
        }
    }, [selectedConversation])

    useEffect(() => {
        const loadConversations = async () => {
            try {
                const response =
                    await conversationService.getConversations()

                const loadedConversations =
                    response.data

                setConversations(
                    loadedConversations
                )

                if (
                    loadedConversations.length > 0
                ) {

                    const latestConversation =
                        loadedConversations[0]
                    setSelectedConversation(
                        latestConversation
                    )

                    const messagesResponse =
                        await messageService.getMessages(
                            latestConversation._id
                        )
                    setMessages(
                        messagesResponse.data
                    )
                }
            } catch (error) {
                console.error(
                    'Failed to load conversations:',
                    error
                )
            }
        }
        loadConversations()
    }, [])

    const handleNewConversation = async () => {
        try {
            const response =
                await conversationService.createConversation(
                    'New Conversation'
                )
            const newConversation =
                response.data
            setConversations((prev) => [
                newConversation,
                ...prev
            ])
            setSelectedConversation(
                newConversation
            )

            setMessages([])
            setMessage('')
            setLoading(false)
        } catch (error) {
            console.error(
                'Failed to create conversation:',
                error
            )
        }
    }

    const handleSelectConversation = async (
        conversation
    ) => {
        try {
            setSelectedConversation(
                conversation
            )
            setMessages([])
            setMessage('')
            setLoading(false)
            const response =
                await messageService.getMessages(
                    conversation._id
                )
            setMessages(
                response.data
            )
        } catch (error) {
            console.error(
                'Failed to load messages:',
                error
            )
        }
    }

    const handleSendMessage = async (e) => {
        if (e) 
            e.preventDefault()


        if (
            !message.trim() ||
            !selectedConversation ||
            loading
        ) 
            return

        const currentMessage =
            message.trim()


        const temporaryUserMessage = {
            _id:
                `temp-${Date.now()}`,
            role:
                'user',
            content:
                currentMessage
        }

        setMessages((prev) => [
            ...prev,
            temporaryUserMessage
        ])

        setMessage('')
        setLoading(true)
        try {
            await messageService.sendMessage(
                selectedConversation._id,
                currentMessage
            )

        } catch (error) {

            console.error(
                'Failed to send message:',
                error
            )

            setMessages((prev) =>

                prev.filter(
                    (item) =>
                        item._id !==
                        temporaryUserMessage._id
                )

            )
            setMessage(
                currentMessage
            )


            setLoading(false)

        }

    }

    const handleDeleteConversation = async (
        conversationId
    ) => {

        try {

            socket.emit(
                'leave-conversation',
                conversationId
            )


            await conversationService.deleteConversation(
                conversationId
            )

            setConversations((prev) =>

                prev.filter(
                    (conversation) =>
                        conversation._id !==
                        conversationId
                )

            )

            if (
                selectedConversation?._id ===
                conversationId
            ) {

                setSelectedConversation(
                    null
                )


                selectedConversationRef.current =
                    null


                setMessages([])

                setMessage('')

                setLoading(false)

            }

        } catch (error) {

            console.error(
                'Failed to delete conversation:',
                error
            )

        }

    }
    return (

        <div className="chat-page">

            <aside className="chat-sidebar">

                <div className="sidebar-top">

                    <div className="sidebar-header">

                        <div className="brand">

                            <div className="brand-icon">
                                AI
                            </div>

                            <span>
                                AI Chatbot
                            </span>

                        </div>

                        <button
                            className="logout-btn"
                            onClick={logout}
                        >
                            Logout
                        </button>

                    </div>

                    <button
                        className="new-chat-btn"
                        onClick={
                            handleNewConversation
                        }
                    >
                        <span>
                            +
                        </span>
                        New Chat
                    </button>

                </div>

                <div className="conversation-section">

                    <div className="conversation-title">
                        Conversations
                    </div>

                    <div className="conversation-list">

                        {conversations.length === 0 && (
                            <div className="empty-conversations">
                                No conversations yet
                            </div>
                        )}

                        {conversations.map(
                            (conversation) => (
                                <div
                                    key={
                                        conversation._id
                                    }

                                    className={`
                                        conversation-item
                                        ${
                                            selectedConversation?._id ===
                                            conversation._id
                                                ? 'active'
                                                : ''
                                        }
                                    `}

                                    onClick={() =>
                                        handleSelectConversation(
                                            conversation
                                        )
                                    }
                                >


                                    <div className="conversation-name">

                                        <span className="chat-icon">

                                            💬

                                        </span>


                                        <span>

                                            {
                                                conversation.title
                                            }

                                        </span>


                                    </div>


                                    <button
                                        className="delete-chat-btn"

                                        onClick={(e) => {

                                            e.stopPropagation()

                                            handleDeleteConversation(
                                                conversation._id
                                            )

                                        }}
                                    >

                                        ×

                                    </button>


                                </div>

                            )
                        )}


                    </div>


                </div>

                <div className="sidebar-user">


                    <div className="user-avatar">

                        {
                            user?.name
                                ?.charAt(0)
                                .toUpperCase()
                        }

                    </div>


                    <div className="user-info">


                        <span className="user-label">

                            Logged in as

                        </span>


                        <span className="user-name">

                            {user?.name}

                        </span>


                    </div>


                </div>


            </aside>


            <main className="chat-main">

                <header className="chat-header">

                    <div>


                        <h2>

                            {
                                selectedConversation

                                    ? selectedConversation.title

                                    : 'New Conversation'
                            }

                        </h2>


                        <span>

                            AI Assistant

                        </span>


                    </div>


                    <div className="online-status">


                        <span></span>


                        Online


                    </div>


                </header>

                <div
                    className="messages-container"
                    ref={messagesContainerRef}
                >

                    {!selectedConversation && (

                        <div className="welcome-message">


                            <div className="welcome-icon">

                                ✨

                            </div>


                            <h1>

                                How can I help you today?

                            </h1>


                            <p>

                                Start a new conversation and
                                ask me anything.

                            </p>


                        </div>

                    )}


                    {selectedConversation &&

                        messages.length === 0 && (

                            <div className="empty-chat">


                                <div className="empty-chat-icon">

                                    💬

                                </div>


                                <h3>

                                    Start the conversation

                                </h3>


                                <p>

                                    Send your first message below.

                                </p>


                            </div>

                        )

                    }


                    <div className="messages-list">


                        {messages.map((msg) => (

                            <div
                                key={msg._id}

                                className={`
                                    message-row
                                    ${
                                        msg.role === 'user'
                                            ? 'user-message'
                                            : 'assistant-message'
                                    }
                                `}
                            >


                                <div className="message-avatar">


                                    {
                                        msg.role === 'user'

                                            ? user?.name
                                                ?.charAt(0)
                                                .toUpperCase()

                                            : 'AI'
                                    }


                                </div>


                                <div className="message-content">


                                    <div className="message-role">


                                        {
                                            msg.role === 'user'

                                                ? 'You'

                                                : 'AI Assistant'
                                        }


                                    </div>


                                    <div className="message-text">


                                        {msg.role === 'assistant' ? (


                                            <Markdown
                                                remarkPlugins={[
                                                    remarkGfm
                                                ]}
                                            >

                                                {
                                                    msg.content
                                                }

                                            </Markdown>


                                        ) : (


                                            <p className="user-text">

                                                {
                                                    msg.content
                                                }

                                            </p>


                                        )}


                                    </div>


                                </div>


                            </div>

                        ))}


                    </div>


                </div>

                <div className="chat-input-area">

                    {loading && (

                        <div className="typing-indicator">


                            <div className="typing-dots">


                                <span></span>

                                <span></span>

                                <span></span>


                            </div>


                            <span className="typing-text">

                                AI is thinking...

                            </span>


                        </div>

                    )}

                    <form
                        className="chat-input-wrapper"
                        onSubmit={handleSendMessage}
                    >


                        <input
                            type="text"

                            value={message}

                            onChange={(e) =>
                                setMessage(
                                    e.target.value
                                )
                            }

                            onKeyDown={(e) => {

                                if (
                                    e.key === 'Enter'
                                ) {

                                    e.preventDefault()

                                    handleSendMessage(e)

                                }

                            }}

                            placeholder="Type your message..."

                            disabled={
                                loading ||
                                !selectedConversation
                            }

                        />


                        <button
                            type="submit"

                            className="send-btn"

                            disabled={
                                !message.trim() ||
                                loading ||
                                !selectedConversation
                            }
                        >

                            {
                                loading
                                    ? '...'
                                    : '➤'
                            }

                        </button>


                    </form>


                    <div className="input-hint">

                        AI can make mistakes.
                        Check important information.

                    </div>


                </div>


            </main>


        </div>

    )

}


export default Chat