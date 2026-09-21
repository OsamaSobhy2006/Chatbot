# AI Chatbot

## About The Project

AI Chatbot is a **Full-Stack AI Chatbot MVP** built with the MERN stack.

The idea is to provide users with a complete AI chat experience where they can create an account, have multiple conversations with an AI assistant, keep their conversations saved, and receive AI responses in real time.

The project focuses on the core features required for a functional AI chatbot, including authentication, conversation management, persistent messages, AI integration, and real-time streaming.

---

## Features

### Authentication
- User registration
- User login
- JWT authentication
- Password hashing with bcrypt
- Protected routes
- Persistent login
- Logout
- Public and protected route handling

### Conversation Management
- Create new conversations
- Multiple conversations per user
- View conversation history
- Switch between conversations
- Delete conversations
- Each user's conversations are isolated and protected

### AI Chat
- AI-powered conversations
- Conversation context
- Previous messages are provided to the AI for context
- AI responses through OpenRouter
- Real-time AI response streaming
- AI typing/generating indicator
- Markdown support
- GitHub-Flavored Markdown support
- Code and formatted responses

### Real-Time Communication
- Socket.IO integration
- Real-time AI streaming
- Streaming response chunks
- AI generation status
- Streaming error handling
- Conversation-based Socket.IO rooms

### Data Persistence
MongoDB is used to persist:

- Users
- Conversations
- Messages
- User and assistant messages
- Conversation timestamps

Users can refresh the application or return later and still access their previous conversations.

### User Interface
- Modern dark-themed landing page
- Login page
- Registration page
- Responsive chat interface
- Conversation sidebar
- User information
- Chat history
- AI message formatting
- Authentication-based navigation
- Protected chat experience

---

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Socket.IO Client
- React Markdown
- Remark GFM
- Bootstrap
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Socket.IO
- Helmet
- CORS

### AI
- OpenRouter
- OpenAI SDK
- Streaming AI responses

---

## Core Application Flow

```text
User
  ↓
Register / Login
  ↓
Authenticated User
  ↓
Create / Select Conversation
  ↓
Send Message
  ↓
Express Backend
  ↓
AI Service
  ↓
OpenRouter
  ↓
AI Model
  ↓
Streaming Response
  ↓
Socket.IO
  ↓
React Chat Interface
  ↓
Save Complete Response
  ↓
MongoDB