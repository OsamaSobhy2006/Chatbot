import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/auth-service'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Register() {

    const navigate = useNavigate()
    const { login } = useAuth()

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: ''
    })

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
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        const newErrors = {
            name: '',
            email: '',
            password: ''
        }

        // Name validation
        if (!form.name.trim()) {
            newErrors.name = 'Name is required'
        } else if (form.name.trim().length < 3) {
            newErrors.name = 'Name must be at least 3 characters'
        }

        // Email validation
        if (!form.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Please enter a valid email'
        }

        // Password validation
        if (!form.password) {
            newErrors.password = 'Password is required'
        } else if (form.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        setErrors(newErrors)

        // Stop request if validation failed
        if (Object.values(newErrors).some(error => error)) {
            return
        }

        try {

            const response = await authService.register(form)

            login(
                response.data.user,
                response.data.token
            )

            navigate('/chat')

        } catch (error) {

            setErrors({
                ...newErrors,
                email: error.response?.data?.message || 'Registration failed'
            })
        }
    }

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>Create Account</h1>

                <p>
                    Create your account and start chatting.
                </p>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    {/* Name */}
                    <div className="input-group">

                        <input
                            name="name"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                        />

                        {errors.name && (
                            <small className="field-error">
                                {errors.name}
                            </small>
                        )}

                    </div>

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
                        Register
                    </button>

                </form>

                <div className="auth-link">

                    Already have an account?{" "}

                    <Link to="/login">
                        Login
                    </Link>

                </div>

            </div>

        </div>
    )
}

export default Register