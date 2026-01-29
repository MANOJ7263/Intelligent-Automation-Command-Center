import React from 'react';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="welcome-page">
            {/* Background Gradients */}
            <div className="bg-blob-1" />
            <div className="bg-blob-2" />

            <div className="welcome-content">
                {/* Logo / Icon */}
                <div className="logo-container">
                    <Sparkles size={40} color="white" />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h1 className="hero-title">
                        District IACC
                    </h1>
                    <p className="hero-subtitle">
                        Intelligent Automation Command Center
                    </p>
                    <p className="hero-desc">
                        Next-generation governance powered by AI and automation. Streamline operations, enhance efficiency, and monitor district performance in real-time.
                    </p>
                </div>

                <div className="action-buttons">
                    <button
                        onClick={() => navigate('/admin/auth')}
                        className="btn-cta"
                    >
                        Access Command Room
                        <ArrowRight size={20} className="ml-2" />
                    </button>

                    <button
                        onClick={() => navigate('/dept/auth')}
                        className="btn-outline-cta"
                    >
                        Register Department
                    </button>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <Zap size={32} className="text-blue" />
                        </div>
                        <h3 className="feature-title">AI-Powered Routing</h3>
                        <p className="feature-text">Automatically classifies tasks and assigns them to the correct department bots.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <Shield size={32} className="text-purple" />
                        </div>
                        <h3 className="feature-title">Secure Governance</h3>
                        <p className="feature-text">Enterprise-grade security with role-based access control and audit trails.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <Sparkles size={32} className="text-green" />
                        </div>
                        <h3 className="feature-title">UiPath Integration</h3>
                        <p className="feature-text">Seamlessly triggers RPA bots for invoice processing and report generation.</p>
                    </div>
                </div>

                <div className="footer-text">
                    © 2026 District Administration. Secure System.
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
