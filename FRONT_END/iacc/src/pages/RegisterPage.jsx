import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Loader2, UserPlus, Building2, Shield, User, Mail, Lock } from 'lucide-react';
import './AuthPage.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: '',
        department: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:8081/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.text();

            if (!response.ok) {
                try {
                    const jsonData = JSON.parse(data);
                    throw new Error(jsonData.message || 'Registration failed');
                } catch (e) {
                    throw new Error(data || 'Registration failed. Please try again.');
                }
            }

            setSuccess('Registration successful! Redirecting to login...');

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.message || 'Failed to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-blob-blue" />
            <div className="auth-blob-purple" />

            <div className="auth-card large">
                <div className="auth-header">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <UserPlus size={24} color="#2563eb" />
                        <h1 className="auth-title" style={{ margin: 0 }}>Register New Account</h1>
                    </div>
                    <p className="auth-desc">Create authorized access for department staff or supervisors.</p>
                </div>

                <div className="auth-content">
                    <form onSubmit={handleRegister}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="username" className="label">Username</label>
                                <div className="input-wrapper">
                                    <User className="input-icon" />
                                    <input
                                        id="username"
                                        name="username"
                                        placeholder="j_doe"
                                        className="input-field"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className="label">Email</label>
                                <div className="input-wrapper">
                                    <Mail className="input-icon" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="j.doe@gov.in"
                                        className="input-field"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="label">Password</label>
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

                        <div className="form-row">
                            <div className="form-group">
                                <label className="label">Role</label>
                                <Select onValueChange={(val) => handleSelectChange('role', val)}>
                                    <SelectTrigger className="input-field">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Shield size={20} style={{ color: '#94a3b8' }} />
                                            <SelectValue placeholder="Select Role" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ROLE_DEPT_HEAD">Department Head</SelectItem>
                                        <SelectItem value="ROLE_STAFF">Staff Member</SelectItem>
                                        <SelectItem value="ROLE_AUTO_SUPERVISOR">Automation Supervisor</SelectItem>
                                        <SelectItem value="ROLE_COLLECTOR">District Collector (Admin)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="form-group">
                                <label className="label">Department</label>
                                <Select onValueChange={(val) => handleSelectChange('department', val)}>
                                    <SelectTrigger className="input-field">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Building2 size={20} style={{ color: '#94a3b8' }} />
                                            <SelectValue placeholder="Select Dept" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="REVENUE">Revenue</SelectItem>
                                        <SelectItem value="HEALTH">Health</SelectItem>
                                        <SelectItem value="EDUCATION">Education</SelectItem>
                                        <SelectItem value="ADMIN">Administration</SelectItem>
                                        <SelectItem value="TRANSPORT">Transport</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {error && (
                            <div className="error-box">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="success-box">
                                <Loader2 className="animate-spin" size={16} />
                                {success}
                            </div>
                        )}

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Complete Registration'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account?{' '}
                        <button onClick={() => navigate('/login')} className="link-primary">
                            Login here
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
