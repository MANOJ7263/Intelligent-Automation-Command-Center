import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2, GraduationCap, Users, Bell, LogOut, Clock,
    MapPin, BarChart2, BookOpen, TrendingUp, CheckCircle2,
    AlertTriangle, Phone, Mail, Award, ChevronRight
} from 'lucide-react';
import { ZONES, DEOS, HEADMASTERS, ZONE_A_SCHOOLS } from '../../data/educationData';
import './EducationDashboard.css';

const STORAGE_KEY = 'edu_deo_assignments';
function getAssignment(deoId) {
    try {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        return all[deoId] || null;
    } catch { return null; }
}

// ─── PENDING STATE ────────────────────────────────────────────────────────────
const PendingView = ({ user, deoInfo }) => {
    const navigate = useNavigate();
    return (
        <div className="edu-pending-page">
            <div className="edu-pending-card">
                <div className="pending-icon">
                    <Clock size={48} color="#f59e0b" />
                </div>
                <h2 className="pending-title">Awaiting Zone Assignment</h2>
                <p className="pending-sub">
                    Welcome, <strong>{deoInfo?.name || user?.username}</strong>.
                    Your account has been created and is pending zone assignment by the <strong>Chief Education Officer (CEO)</strong>.
                </p>
                <div className="pending-info-box">
                    <div className="pending-info-row"><span>Username</span><strong>{user?.username}</strong></div>
                    <div className="pending-info-row"><span>Role</span><strong>District Education Officer (DEO)</strong></div>
                    <div className="pending-info-row"><span>Department</span><strong>Education</strong></div>
                    <div className="pending-info-row"><span>Status</span><span className="edu-badge amber">Pending Assignment</span></div>
                    <div className="pending-info-row"><span>Registered on</span><strong>{deoInfo?.registeredOn || '—'}</strong></div>
                </div>
                <div className="pending-contact">
                    <AlertTriangle size={14} color="#f59e0b" />
                    Contact the CEO to get your zone assigned. Once assigned, refresh this page to access your dashboard.
                </div>
                <div className="pending-actions">
                    <button className="btn-pending-refresh" onClick={() => window.location.reload()}>
                        Refresh Status
                    </button>
                    <button className="btn-pending-logout" onClick={() => { localStorage.clear(); navigate('/login'); }}>
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── ASSIGNED DEO DASHBOARD ────────────────────────────────────────────────────
const DEOView = ({ user, deoInfo, assignment }) => {
    const navigate = useNavigate();
    const [tab, setTab] = useState('overview');

    const zoneObj = ZONES.find(z => z.name === assignment.zone) || ZONES[0];
    const zoneSchools = ZONE_A_SCHOOLS; // Zone A for testDEO1
    const zoneHMs = HEADMASTERS.filter(hm => hm.zoneId === zoneObj.id);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart2 },
        { id: 'schools', label: 'Schools', icon: Building2 },
        { id: 'headmasters', label: 'Headmasters', icon: Users },
        { id: 'performance', label: 'Performance', icon: TrendingUp },
    ];

    return (
        <div className="edu-dashboard">
            {/* Sidebar */}
            <aside className="edu-sidebar green">
                <div className="edu-brand">
                    <div className="edu-logo green-logo"><GraduationCap size={22} color="#fff" /></div>
                    <div>
                        <div className="edu-brand-name">Education Dept.</div>
                        <div className="edu-brand-sys">DEO Portal</div>
                    </div>
                </div>
                <div className="edu-role-tag green-tag">Dist. Education Officer</div>
                <nav className="edu-nav">
                    {tabs.map(t => {
                        const Icon = t.icon;
                        return (
                            <button key={t.id} className={`edu-nav-item ${tab === t.id ? 'active green-active' : ''}`} onClick={() => setTab(t.id)}>
                                <Icon size={17} />{t.label}
                            </button>
                        );
                    })}
                </nav>
                <div className="edu-sidebar-footer">
                    <div className="edu-user">
                        <div className="edu-avatar green-av">{user?.username?.[0]?.toUpperCase() || 'D'}</div>
                        <div>
                            <div className="edu-username">{user?.username || 'testDEO1'}</div>
                            <div className="edu-userrole">DEO – {zoneObj.name.split('–')[0].trim()}</div>
                        </div>
                    </div>
                    <button className="edu-logout" onClick={() => { localStorage.clear(); navigate('/login'); }}>
                        <LogOut size={16} />
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="edu-main">
                <header className="edu-topbar">
                    <div>
                        <div className="edu-breadcrumb">Education · DEO Dashboard · {zoneObj.name}</div>
                        <h1 className="edu-page-title">
                            {tab === 'overview' && 'Zone Overview'}
                            {tab === 'schools' && 'Schools in My Zone'}
                            {tab === 'headmasters' && 'Headmasters Under Me'}
                            {tab === 'performance' && 'Zone Performance'}
                        </h1>
                    </div>
                    <div className="edu-topbar-right">
                        <div className="edu-badge-pill green"><MapPin size={12} />{zoneObj.name.split('–')[0]}</div>
                        <button className="edu-icon-btn"><Bell size={18} /></button>
                    </div>
                </header>

                {/* Hero */}
                <div className="edu-hero green-hero">
                    <div className="hero-l">
                        <MapPin size={36} color="rgba(255,255,255,0.9)" />
                        <div>
                            <div className="hero-title">{assignment.zone}</div>
                            <div className="hero-sub">DEO: {deoInfo?.name || user?.username} · Academic Year 2025–26</div>
                        </div>
                    </div>
                    <div className="hero-badges">
                        <span><CheckCircle2 size={13} />Zone Active</span>
                        <span><Award size={13} />{zoneObj.schools} Schools</span>
                    </div>
                </div>

                <div className="edu-content">
                    {/* ═══ OVERVIEW ═══ */}
                    {tab === 'overview' && (
                        <>
                            <div className="edu-stats-row">
                                <div className="edu-stat-card" style={{ '--c': '#10b981' }}>
                                    <div className="edu-stat-icon" style={{ background: '#10b98118' }}><Building2 size={24} color="#10b981" /></div>
                                    <div><div className="edu-stat-value">{zoneObj.schools}</div><div className="edu-stat-label">Schools in Zone</div></div>
                                </div>
                                <div className="edu-stat-card" style={{ '--c': '#3b82f6' }}>
                                    <div className="edu-stat-icon" style={{ background: '#3b82f618' }}><GraduationCap size={24} color="#3b82f6" /></div>
                                    <div><div className="edu-stat-value">{zoneObj.students.toLocaleString()}</div><div className="edu-stat-label">Students</div></div>
                                </div>
                                <div className="edu-stat-card" style={{ '--c': '#f59e0b' }}>
                                    <div className="edu-stat-icon" style={{ background: '#f59e0b18' }}><Users size={24} color="#f59e0b" /></div>
                                    <div><div className="edu-stat-value">{zoneHMs.length}</div><div className="edu-stat-label">Headmasters</div></div>
                                </div>
                                <div className="edu-stat-card" style={{ '--c': '#8b5cf6' }}>
                                    <div className="edu-stat-icon" style={{ background: '#8b5cf618' }}><BookOpen size={24} color="#8b5cf6" /></div>
                                    <div><div className="edu-stat-value">{zoneSchools.reduce((s, sc) => s + sc.teachers, 0)}</div><div className="edu-stat-label">Teachers</div></div>
                                </div>
                            </div>

                            {/* Zone Top Schools */}
                            <div className="edu-card">
                                <div className="edu-card-header">
                                    <h3>Top Performing Schools</h3>
                                    <button className="edu-tag-btn" onClick={() => setTab('schools')}>All Schools</button>
                                </div>
                                <table className="edu-table">
                                    <thead><tr><th>School</th><th>Type</th><th>Students</th><th>HM</th><th>Pass %</th></tr></thead>
                                    <tbody>
                                        {[...zoneSchools].sort((a, b) => b.performance - a.performance).slice(0, 5).map(s => (
                                            <tr key={s.id}>
                                                <td className="fw-500">{s.name}</td>
                                                <td><span className="edu-badge blue">{s.type}</span></td>
                                                <td>{s.students}</td>
                                                <td>
                                                    {s.hmId ? <span className="edu-badge green">✓ Assigned</span> : <span className="edu-badge amber">Vacant</span>}
                                                </td>
                                                <td>
                                                    <div className="edu-progress">
                                                        <div className="edu-progress-bar" style={{ width: `${s.performance}%`, background: s.performance >= 90 ? '#10b981' : '#f59e0b' }} />
                                                        <span>{s.performance}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Headmaster quick view */}
                            <div className="edu-card">
                                <div className="edu-card-header">
                                    <h3>My Headmasters</h3>
                                    <button className="edu-tag-btn" onClick={() => setTab('headmasters')}>Full View</button>
                                </div>
                                <div className="hm-cards-row">
                                    {zoneHMs.slice(0, 4).map(hm => (
                                        <div key={hm.id} className="hm-mini-card">
                                            <div className="hm-mini-avatar green-av">{hm.name[0]}</div>
                                            <div className="hm-mini-name">{hm.name}</div>
                                            <div className="hm-mini-school">{hm.school}</div>
                                            <div className="hm-mini-stats">{hm.students} students · {hm.teachers} teachers</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ═══ SCHOOLS ═══ */}
                    {tab === 'schools' && (
                        <div className="edu-card">
                            <div className="edu-card-header">
                                <h3>All Schools – {assignment.zone}</h3>
                                <span className="edu-tag-info">{zoneSchools.length} Schools</span>
                            </div>
                            <table className="edu-table">
                                <thead><tr><th>#</th><th>School Name</th><th>Type</th><th>Medium</th><th>Estd.</th><th>Students</th><th>Teachers</th><th>Pass %</th><th>Aid</th></tr></thead>
                                <tbody>
                                    {zoneSchools.map((s, i) => (
                                        <tr key={s.id}>
                                            <td className="text-muted">{i + 1}</td>
                                            <td className="fw-500">{s.name}</td>
                                            <td><span className="edu-badge blue">{s.type}</span></td>
                                            <td style={{ fontSize: '0.8rem' }}>{s.medium}</td>
                                            <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{s.estd}</td>
                                            <td>{s.students}</td>
                                            <td>{s.teachers}</td>
                                            <td>
                                                <div className="edu-progress">
                                                    <div className="edu-progress-bar" style={{ width: `${s.performance}%`, background: s.performance >= 90 ? '#10b981' : s.performance >= 80 ? '#f59e0b' : '#ef4444' }} />
                                                    <span>{s.performance}%</span>
                                                </div>
                                            </td>
                                            <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.aidStatus}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ═══ HEADMASTERS ═══ */}
                    {tab === 'headmasters' && (
                        <div className="edu-card">
                            <div className="edu-card-header">
                                <h3>Headmasters – My Zone</h3>
                                <span className="edu-tag-info">{zoneHMs.length} HMs</span>
                            </div>
                            <table className="edu-table">
                                <thead><tr><th>Name</th><th>School</th><th>Phone</th><th>Email</th><th>Students</th><th>Teachers</th><th>Status</th></tr></thead>
                                <tbody>
                                    {zoneHMs.map(hm => (
                                        <tr key={hm.id}>
                                            <td>
                                                <div className="edu-name-cell">
                                                    <div className="edu-av green">{hm.name[0]}</div>
                                                    {hm.name}
                                                </div>
                                            </td>
                                            <td className="fw-500">{hm.school}</td>
                                            <td style={{ fontSize: '0.78rem' }}>{hm.phone}</td>
                                            <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{hm.email}</td>
                                            <td>{hm.students}</td>
                                            <td>{hm.teachers}</td>
                                            <td><span className={`edu-badge ${hm.status === 'active' ? 'green' : 'amber'}`}>{hm.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ═══ PERFORMANCE ═══ */}
                    {tab === 'performance' && (
                        <div className="edu-card">
                            <h3 className="edu-card-title">Zone A Performance Summary</h3>
                            <div className="perf-grid">
                                {[
                                    { label: 'SSLC Pass Rate', value: '97.4%', detail: '2024–25', color: '#10b981' },
                                    { label: 'HSC Pass Rate', value: '94.2%', detail: '2024–25', color: '#3b82f6' },
                                    { label: 'Dropout Rate', value: '1.2%', detail: 'Down from 2.1%', color: '#ef4444' },
                                    { label: 'Avg Attendance', value: '89.3%', detail: 'This term', color: '#f59e0b' },
                                    { label: 'Schools with 100%', value: '3', detail: 'Full pass schools', color: '#8b5cf6' },
                                    { label: 'State Rank (Zone)', value: '#2', detail: 'Among 5 zones', color: '#06b6d4' },
                                ].map((p, i) => (
                                    <div key={i} className="perf-card" style={{ '--c': p.color }}>
                                        <div className="perf-value" style={{ color: p.color }}>{p.value}</div>
                                        <div className="perf-label">{p.label}</div>
                                        <div className="perf-detail">{p.detail}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// ─── MAIN DEO DASHBOARD (decides pending or assigned) ─────────────────────────
const DEODashboard = () => {
    const [user, setUser] = useState(null);
    const [assignment, setAssignment] = useState(null);

    useEffect(() => {
        const u = localStorage.getItem('user');
        if (u) {
            const parsed = JSON.parse(u);
            setUser(parsed);
            // Check if CEO has assigned this DEO
            const deoInfo = DEOS.find(d => d.username === parsed.username);
            if (deoInfo) {
                const a = getAssignment(deoInfo.id);
                // Also check if DEO had a pre-existing zone (demo data)
                if (a) setAssignment(a);
                else if (deoInfo.zone) setAssignment({ zone: deoInfo.zone, headmasters: [] });
                else setAssignment(null);
            }
        }
    }, []);

    if (!user) return <div className="edu-loading">Loading...</div>;

    const deoInfo = DEOS.find(d => d.username === user.username) || DEOS[0];

    if (!assignment) return <PendingView user={user} deoInfo={deoInfo} />;
    return <DEOView user={user} deoInfo={deoInfo} assignment={assignment} />;
};

export default DEODashboard;
