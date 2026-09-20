import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/auth-service'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Login() {

    const navigate = useNavigate()
    const { login } = useAuth()

    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    })

    const [serverError, setServerError] = useState('')

    const handleChange = (e) => {

        const { name, value } = e.target

        setForm({
            ...form,
            [name]: value
        })

        setErrors({
            ...errors,
            [name]: ''
        })

        setServerError('')
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        const newErrors = {
            email: '',
            password: ''
        }

        if (!form.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Please enter a valid email'
        }

        if (!form.password) {
            newErrors.password = 'Password is required'
        } else if (form.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        setErrors(newErrors)

        if (Object.values(newErrors).some(error => error)) {
            return
        }

        try {

            const response = await authService.login(form)

            login(
                response.data.user,
                response.data.token
            )

            navigate('/chat')

        } catch (error) {

            setServerError(
                error.response?.data?.message ||
                'Login failed'
            )
        }
    }

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>Welcome Back</h1>

                <p>
                    Login to continue to your AI chatbot.
                </p>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    {/* Email */}
                    <div className="input-group">

                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                        />

                        {errors.email && (
                            <small className="field-error">
                                {errors.email}
                            </small>
                        )}

                    </div>

                    {/* Password */}
                    <div className="input-group">

                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                        />

                        {errors.password && (
                            <small className="field-error">
                                {errors.password}
                            </small>
                        )}

                    </div>

                    <button type="submit">
                        Login
                    </button>

                    {/* Backend error */}
                    {serverError && (
                        <div className="auth-server-error">
                            {serverError}
                        </div>
                    )}

                </form>

                <div className="auth-link">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Register
                    </Link>

                </div>

            </div>

        </div>
    )
}

export default Login