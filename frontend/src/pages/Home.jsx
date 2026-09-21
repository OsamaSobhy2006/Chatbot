import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import './Home.css'


function Home() {

    const { token, user, logout } = useAuth()

    const isLoggedIn = !!token


    return (

        <div className="home-page">


            <nav className="navbar">

                <Link
                    to="/"
                    className="logo"
                >
                    AI Chatbot
                </Link>


                <div className="nav-links">

                    {isLoggedIn ? (

                        <>
                            <Link
                                to="/chat"
                                className="login-btn"
                            >
                                Chat
                            </Link>

                            <button
                                onClick={logout}
                                className="register-btn"
                            >
                                Logout
                            </button>
                        </>

                    ) : (

                        <>
                            <Link to="/login">
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="register-btn"
                            >
                                Get Started
                            </Link>
                        </>

                    )}

                </div>

            </nav>


            <main className="hero">

                <div className="hero-content">

                    <span className="badge">
                        AI Powered Chatbot
                    </span>


                    <h1>

                        {isLoggedIn ? (
                            <>
                                Welcome Back,
                                <span>
                                    {' '}{user?.name}
                                </span>
                            </>
                        ) : (
                            <>
                                Your Intelligent
                                <span>
                                    {' '}AI Assistant
                                </span>
                            </>
                        )}

                    </h1>


                    <p>

                        {isLoggedIn ? (
                            <>
                                Continue your conversations,
                                ask questions, and chat with
                                your personal AI assistant.
                            </>
                        ) : (
                            <>
                                Chat, ask questions, get answers,
                                and manage your conversations
                                with your personal AI assistant.
                            </>
                        )}

                    </p>



                    <div className="hero-buttons">

                        {isLoggedIn ? (

                            <>
                                <Link
                                    to="/chat"
                                    className="primary-btn"
                                >
                                    Continue Chatting
                                </Link>

                                <button
                                    onClick={logout}
                                    className="secondary-btn"
                                >
                                    Logout
                                </button>
                            </>

                        ) : (

                            <>
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
                            </>

                        )}

                    </div>

                </div>

            </main>

        </div>

    )
}


export default Home