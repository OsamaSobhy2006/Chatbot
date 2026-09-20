import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
    return (
        <div className="home-page">

            <nav className="navbar">

                <Link to="/" className="logo">
                    AI Chatbot
                </Link>

                <div className="nav-links">
                    <Link to="/login">
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="register-btn"
                    >
                        Get Started
                    </Link>
                </div>

            </nav>

            <main className="hero">

                <div className="hero-content">

                    <span className="badge">
                        AI Powered Chatbot
                    </span>

                    <h1>
                        Your Intelligent
                        <span> AI Assistant</span>
                    </h1>

                    <p>
                        Chat, ask questions, get answers,
                        and manage your conversations
                        with your personal AI assistant.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/register"
                            className="primary-btn"
                        >
                            Start Chatting
                        </Link>

                        <Link
                            to="/login"
                            className="secondary-btn"
                        >
                            Login
                        </Link>

                    </div>

                </div>

            </main>

        </div>
    )
}

export default Home