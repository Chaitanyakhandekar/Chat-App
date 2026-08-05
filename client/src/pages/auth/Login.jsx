import React from 'react'
import { userApi } from '../../api/user.api'
import { useContext } from 'react'
import { authContext } from '../../context/AuthProvider.jsx'
import { useNavigate } from 'react-router-dom'
import { userAuthStore } from '../../store/userStore.js'
import { socket } from '../../socket/socket.js'
import { socketEvents } from '../../constants/socketEvents.js'
import { MessageCircle, Mail, Lock } from 'lucide-react'

function Login() {

    const [user, setUser] = React.useState({
        email: "",
        password: ""
    })
    const setUser1 = userAuthStore().setUser
    const authData = useContext(authContext);
    const navigate = useNavigate()

    const handleUserChange = (e) => {
        setUser((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const login = async (e) => {
        e.preventDefault();
        const response = await userApi.loginUser(user);
        if (response.success) {
            authData.login(response.data);
            setUser1(response.data)
            if (!socket.connected) {
                socket.connect();
            } else {
                socket.emit(socketEvents.USER_LOGGED_IN)
            }
            navigate('/home')
        }
    }

    return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center px-4">

            {/* Card */}
            <div className="w-full max-w-sm bg-surface-800 border border-border rounded-lg shadow-overlay animate-slide-up">

                {/* Header */}
                <div className="flex flex-col items-center pt-10 pb-6 px-8">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg mb-5 bg-accent">
                        <MessageCircle size={22} color="#fff" />
                    </div>
                    <h1 className="text-lg font-semibold text-text-primary tracking-tight">Welcome back</h1>
                    <p className="text-sm text-text-muted mt-1.5">Sign in to continue messaging</p>
                </div>

                {/* Divider */}
                <div className="h-px bg-border mx-8" />

                {/* Form */}
                <form className="flex flex-col gap-3.5 px-8 pt-6 pb-8" onSubmit={login}>

                    {/* Email */}
                    <div className="relative group">
                        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none transition-colors group-focus-within:text-accent-light" />
                        <input
                            className="input-field pl-9"
                            type="email"
                            placeholder="Email address"
                            name="email"
                            value={user.email}
                            onChange={handleUserChange}
                        />
                    </div>

                    {/* Password */}
                    <div className="relative group">
                        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none transition-colors group-focus-within:text-accent-light" />
                        <input
                            className="input-field pl-9"
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={user.password}
                            onChange={handleUserChange}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn-primary w-full h-11 mt-1 cursor-pointer"
                        onClick={login}
                    >
                        Sign In
                    </button>

                    {/* Footer link */}
                    <p className="text-center text-xs text-text-muted mt-1">
                        Don't have an account?{' '}
                        <a href="/register" className="text-accent-light hover:text-accent transition-colors duration-150 font-medium">
                            Create one
                        </a>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login