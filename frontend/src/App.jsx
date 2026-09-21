import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route path="/register" element={
                            <PublicRoute>
                                <Register />
                            </PublicRoute>
                        }
                    />
                    <Route path="/chat" element={
                            <ProtectedRoute>
                                <Chat />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/home" replace />}
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App