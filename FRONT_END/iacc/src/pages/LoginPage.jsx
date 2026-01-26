import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Lock, User, ArrowRight } from 'lucide-react';
import './AuthPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Real API Call
            const response = await fetch('http://localhost:8081/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                // Attempt to parse JSON error if possible
                try {
                    const errJson = JSON.parse(errorText);
                    throw new Error(errJson.message || 'Login failed.');
                } catch (e) {
                    console.error("Server Error:", errorText);
                    throw new Error(errorText || 'Login failed. Please check your credentials.');
                }
            }

            const textData = await response.text();
            let data;
            try {
                data = JSON.parse(textData);
            } catch (e) {
                console.error("JSON Parse Error. Raw text:", textData);
                throw new Error("Invalid response from server");
            }

            console.log("Login Success Data:", data);

            // Save token and user details
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            // Role-Redirect Check
            const userRole = data.roles && data.roles.length > 0 ? data.roles[0] : '';
            console.log("User Role:", userRole);

            switch (userRole) {
                case 'ROLE_COLLECTOR':
                    navigate('/admin-dashboard');
                    break;
                case 'ROLE_DEPT_HEAD':
                    navigate('/dept-dashboard');
                    break;
                case 'ROLE_STAFF':
                    navigate('/staff-portal');
                    break;
                case 'ROLE_AUTO_SUPERVISOR':
                    navigate('/dashboard');
                    break;
                default:
                    console.warn("Unknown role, defaulting to dashboard:", userRole);
                    navigate('/dashboard');
            }

        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-blob-blue" />
            <div className="auth-blob-purple" />

            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-desc">Enter your credentials to access the command center</p>
                </div>

                <div className="auth-content">
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="username" className="label">Username</label>
                            <div className="input-wrapper">
                                <User className="input-icon" />
                                <input
                                    id="username"
                                    name="username"
                                    placeholder="e.g., district_collector"
                                    className="input-field"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label htmlFor="password" className="label">Password</label>
                                <a href="#" style={{ fontSize: '0.75rem', color: '#2563eb', textDecoration: 'none' }}>Forgot password?</a>
                            </div>
                            <div className="input-wrapper">
                                <Lock className="input-icon" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    className="input-field"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="error-box">
                                <Lock size={16} />
                                {error}
                            </div>
                        )}

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Sign In <ArrowRight size={16} />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account?{' '}
                        <button onClick={() => navigate('/register')} className="link-primary">
                            Register Department
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
