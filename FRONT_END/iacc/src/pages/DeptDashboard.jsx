import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Users, Building2, Activity, CheckCircle2, Clock, AlertTriangle,
    Bot, FileText, TrendingUp, LogOut, BarChart2, Layers,
    GraduationCap, Heart, Truck, Banknote, BarChart3, Settings,
    ChevronRight, Bell, User, Home, ShieldCheck, Zap
} from 'lucide-react';
import { getDeptConfig, getRoleConfig } from '../config/departmentConfig';

// ─── Lazy-load Education role dashboards ────────────────────────────────────
const CEODashboard = React.lazy(() => import('./education/CEODashboard'));
const DEODashboard = React.lazy(() => import('./education/DEODashboard'));
const HeadmasterDashboard = React.lazy(() => import('./education/HeadmasterDashboard'));

import './DeptDashboard.css';

// ─── Sidebar Nav Config per Role ──────────────────────────────────────────────
const getNavItems = (dept, subRole) => {
    const base = [
        { icon: Home, label: 'Overview', id: 'overview' },
        { icon: Users, label: 'Team Members', id: 'team' },
        { icon: Activity, label: 'Tasks & Workflows', id: 'tasks' },
        { icon: Bot, label: 'Automation', id: 'automation' },
        { icon: FileText, label: 'Reports', id: 'reports' },
        { icon: Settings, label: 'Settings', id: 'settings' },
    ];

    const roleUpper = (subRole || '').toUpperCase().replace('-', '_');
    if (['CEO', 'CMO', 'CTO', 'CFO', 'CRO'].includes(roleUpper)) {
        base.splice(2, 0, { icon: Layers, label: 'Sub-Offices', id: 'suboffices' });
        base.splice(3, 0, { icon: TrendingUp, label: 'Analytics', id: 'analytics' });
    } else if (['DEO', 'DHO', 'DTO', 'DFO', 'DRO'].includes(roleUpper)) {
        base.splice(2, 0, { icon: Building2, label: 'Institutions', id: 'institutions' });
        base.splice(3, 0, { icon: TrendingUp, label: 'Analytics', id: 'analytics' });
    }
    return base;
};

// ─── Department Icon Map ─────────────────────────────────────────────────────
const DEPT_ICONS = {
    EDUCATION: GraduationCap,
    HEALTH: Heart,
    TRANSPORT: Truck,
    FINANCE: Banknote,
    REVENUE: BarChart3,
};

// ─── Stats Component ──────────────────────────────────────────────────────────
const OverviewStats = ({ deptConfig, subRole }) => {
    const roleUpper = (subRole || '').toUpperCase().replace('-', '_');
    const isHead = ['CEO', 'CMO', 'CTO', 'CFO', 'CRO'].includes(roleUpper);
    const isSub = ['DEO', 'DHO', 'DTO', 'DFO', 'DRO'].includes(roleUpper);

    const stats = isHead ? [
        { label: 'Sub-Offices', value: '12', icon: Building2, trend: '+2 this month', color: '#3b82f6' },
        { label: 'Total Staff', value: '247', icon: Users, trend: '+15 this quarter', color: '#10b981' },
        { label: 'Active Tasks', value: '38', icon: Activity, trend: '5 due today', color: '#f59e0b' },
        { label: 'Completed', value: '94%', icon: CheckCircle2, trend: 'Above target', color: '#8b5cf6' },
    ] : isSub ? [
        { label: 'Institutions', value: '8', icon: Building2, trend: '2 new this year', color: '#3b82f6' },
        { label: 'Staff Members', value: '64', icon: Users, trend: '+4 this month', color: '#10b981' },
        { label: 'Active Tasks', value: '14', icon: Activity, trend: '3 due today', color: '#f59e0b' },
        { label: 'Compliance', value: '87%', icon: ShieldCheck, trend: 'Below target', color: '#ef4444' },
    ] : [
        { label: 'My Tasks', value: '7', icon: Activity, trend: '2 due today', color: '#3b82f6' },
        { label: 'Completed', value: '23', icon: CheckCircle2, trend: 'This month', color: '#10b981' },
        { label: 'Pending Review', value: '3', icon: Clock, trend: 'Awaiting approval', color: '#f59e0b' },
        { label: 'Alerts', value: '1', icon: AlertTriangle, trend: 'Action needed', color: '#ef4444' },
    ];

    return (
        <div className="stats-grid">
            {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                    <div key={i} className="stat-card" style={{ '--sc': s.color }}>
                        <div className="stat-icon-wrap">
                            <Icon size={22} color={s.color} />
                        </div>
                        <div className="stat-body">
                            <span className="stat-value">{s.value}</span>
                            <span className="stat-label">{s.label}</span>
                            <span className="stat-trend">{s.trend}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const RecentActivity = ({ deptConfig }) => {
    const items = [
        { time: '2h ago', action: 'New task assigned: "Submit Q1 Report"', type: 'task', status: 'pending' },
        { time: '4h ago', action: 'Automation bot completed "Data Sync"', type: 'bot', status: 'done' },
        { time: 'Yesterday', action: 'Staff registration approved', type: 'member', status: 'done' },
        { time: '2 days ago', action: 'Alert: "Quarterly target at 72% — below threshold"', type: 'alert', status: 'alert' },
        { time: '3 days ago', action: 'Report submitted: "Monthly Operations Summary"', type: 'report', status: 'done' },
    ];
    const icons = { task: Clock, bot: Bot, member: User, alert: AlertTriangle, report: FileText };
    const colors = { pending: '#f59e0b', done: '#10b981', alert: '#ef4444' };
    return (
        <div className="activity-card">
            <h3 className="section-title">Recent Activity</h3>
            <div className="activity-list">
                {items.map((item, i) => {
                    const Icon = icons[item.type];
                    return (
                        <div key={i} className="activity-item">
                            <div className="activity-dot" style={{ background: colors[item.status] }} />
                            <Icon size={14} color={colors[item.status]} style={{ flexShrink: 0 }} />
                            <div className="activity-content">
                                <span className="activity-text">{item.action}</span>
                                <span className="activity-time">{item.time}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const AutomationPanel = () => {
    const bots = [
        { name: 'Data Sync Bot', status: 'running', lastRun: '2h ago', runs: 142 },
        { name: 'Report Generator', status: 'idle', lastRun: '6h ago', runs: 89 },
        { name: 'Compliance Checker', status: 'running', lastRun: '30m ago', runs: 234 },
        { name: 'Alert Notifier', status: 'idle', lastRun: '1d ago', runs: 67 },
    ];
    return (
        <div className="auto-card">
            <h3 className="section-title">Automation Panel</h3>
            <div className="bot-list">
                {bots.map((bot, i) => (
                    <div key={i} className="bot-item">
                        <Bot size={20} color={bot.status === 'running' ? '#10b981' : '#94a3b8'} />
                        <div className="bot-info">
                            <span className="bot-name">{bot.name}</span>
                            <span className="bot-meta">Last run: {bot.lastRun} · {bot.runs} total runs</span>
                        </div>
                        <span className={`bot-status ${bot.status}`}>{bot.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Generic Dashboard (non-Education departments) ────────────────────────────
const GenericDeptDashboard = ({ dept, subRole, deptConfig, roleConfig }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [user, setUser] = useState(null);
    const DeptIcon = DEPT_ICONS[(dept || '').toUpperCase()] || Building2;
    const navItems = getNavItems(dept, subRole);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="content-grid">
                        <OverviewStats deptConfig={deptConfig} subRole={subRole} dept={dept} />
                        <div className="content-row">
                            <RecentActivity deptConfig={deptConfig} />
                            <AutomationPanel />
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="placeholder-card">
                        <Settings size={48} color={deptConfig.color} />
                        <h3>{navItems.find(n => n.id === activeTab)?.label || 'Coming Soon'}</h3>
                        <p>This section for {deptConfig.label} is being developed.</p>
                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Full implementation in Phase 2.</p>
                    </div>
                );
        }
    };

    return (
        <div className="dept-dashboard">
            <aside className="dept-sidebar" style={{ '--dc': deptConfig.color, '--dg': deptConfig.gradient }}>
                <div className="sidebar-brand">
                    <div className="sidebar-logo" style={{ background: deptConfig.gradient }}>
                        <DeptIcon size={22} color="#fff" />
                    </div>
                    <div className="sidebar-brand-text">
                        <span className="sidebar-dept">{deptConfig.label.replace(' Department', '')}</span>
                        <span className="sidebar-system">IACC Portal</span>
                    </div>
                </div>
                <div className="sidebar-role-pill">
                    <ShieldCheck size={14} color={deptConfig.color} />
                    <span>{roleConfig?.title || subRole?.toUpperCase()}</span>
                </div>
                <nav className="sidebar-nav">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-avatar" style={{ background: deptConfig.gradient }}>
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="sidebar-user-info">
                            <span className="sidebar-username">{user?.username || 'User'}</span>
                            <span className="sidebar-user-role">{roleConfig?.level || 'Staff'}</span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={16} />
                    </button>
                </div>
            </aside>

            <main className="dept-main">
                <header className="dept-topbar">
                    <div className="topbar-left">
                        <div className="page-breadcrumb">
                            <span className="breadcrumb-dept">{deptConfig.label}</span>
                            <ChevronRight size={14} color="#94a3b8" />
                            <span className="breadcrumb-role">{roleConfig?.title || subRole}</span>
                        </div>
                        <h1 className="page-title">
                            {navItems.find(n => n.id === activeTab)?.label || 'Overview'}
                        </h1>
                    </div>
                    <div className="topbar-right">
                        <button className="topbar-icon-btn"><Bell size={18} /></button>
                        <div className="topbar-user-chip" style={{ '--dc': deptConfig.color }}>
                            <div className="chip-avatar" style={{ background: deptConfig.gradient }}>
                                {user?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <span className="chip-name">{user?.username || 'User'}</span>
                                <span className="chip-role">{roleConfig?.abbr || '—'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="dept-hero" style={{ background: deptConfig.gradient }}>
                    <div className="hero-left">
                        <div className="hero-icon"><DeptIcon size={32} color="rgba(255,255,255,0.9)" /></div>
                        <div>
                            <h2 className="hero-title">{roleConfig?.title || subRole}</h2>
                            <p className="hero-sub">{deptConfig.label}</p>
                        </div>
                    </div>
                    <div className="hero-badges">
                        <div className="hero-badge"><Zap size={14} />Automation Active</div>
                        <div className="hero-badge"><CheckCircle2 size={14} />System Online</div>
                    </div>
                </div>

                <div className="dept-content">{renderContent()}</div>
            </main>
        </div>
    );
};

// ─── Main Router Component ────────────────────────────────────────────────────
const DeptDashboard = () => {
    const { dept, subRole } = useParams();
    const navigate = useNavigate();

    const deptUpper = (dept || '').toUpperCase();
    const subRoleUpper = (subRole || '').toUpperCase().replace(/-/g, '_');
    const deptConfig = getDeptConfig(dept);
    const roleConfig = getRoleConfig(dept, subRoleUpper);

    if (!deptConfig) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                <AlertTriangle size={48} />
                <h2>Department not found: <code>{dept}</code></h2>
                <button onClick={() => navigate('/login')} style={{ marginTop: '1rem', padding: '0.625rem 1.5rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.625rem', cursor: 'pointer' }}>
                    Back to Login
                </button>
            </div>
        );
    }

    // ── Education Department: route to specific role dashboards ──────────────
    if (deptUpper === 'EDUCATION') {
        if (subRoleUpper === 'CEO') {
            return (
                <React.Suspense fallback={<div className="dept-loading">Loading CEO Dashboard…</div>}>
                    <CEODashboard />
                </React.Suspense>
            );
        }
        if (subRoleUpper === 'DEO') {
            return (
                <React.Suspense fallback={<div className="dept-loading">Loading DEO Dashboard…</div>}>
                    <DEODashboard />
                </React.Suspense>
            );
        }
        if (subRoleUpper === 'HEADMASTER') {
            return (
                <React.Suspense fallback={<div className="dept-loading">Loading Headmaster Dashboard…</div>}>
                    <HeadmasterDashboard />
                </React.Suspense>
            );
        }
    }

    // ── All other departments: generic dashboard ──────────────────────────────
    return <GenericDeptDashboard dept={dept} subRole={subRole} deptConfig={deptConfig} roleConfig={roleConfig} />;
};

export default DeptDashboard;
