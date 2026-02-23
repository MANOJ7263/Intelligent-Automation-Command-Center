import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Building2, GraduationCap, TrendingUp, LogOut, Bell,
    CheckCircle2, Clock, AlertTriangle, ChevronRight, MapPin,
    Phone, Mail, Edit3, UserCheck, X, Save, BarChart2,
    Activity, Shield, BookOpen, Award, Zap
} from 'lucide-react';
import { DISTRICT, ZONES, DEOS, HEADMASTERS, ZONE_A_SCHOOLS } from '../../data/educationData';
import './EducationDashboard.css';

const STORAGE_KEY = 'edu_deo_assignments';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getAssignments() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
}
function saveAssignments(obj) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color }) => (
    <div className="edu-stat-card" style={{ '--c': color }}>
        <div className="edu-stat-icon" style={{ background: `${color}18` }}>
            <Icon size={24} color={color} />
        </div>
        <div>
            <div className="edu-stat-value">{value}</div>
            <div className="edu-stat-label">{label}</div>
            {sub && <div className="edu-stat-sub">{sub}</div>}
        </div>
    </div>
);

// ─── Assign DEO Modal ─────────────────────────────────────────────────────────
const AssignModal = ({ deo, onClose, onSave }) => {
    const [zone, setZone] = useState(deo.zone || '');
    const [selectedHMs, setSelectedHMs] = useState([]);

    const zoneHMs = HEADMASTERS.filter(hm => hm.zoneId === (ZONES.find(z => z.name === zone)?.id || 'Z1'));

    return (
        <div className="modal-backdrop">
            <div className="modal-box">
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">Assign Zone & Headmasters</h2>
                        <p className="modal-sub">DEO: <strong>{deo.name}</strong></p>
                    </div>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="modal-body">
                    <div className="form-group">
                        <label className="modal-label">Assign to Zone</label>
                        <select className="modal-select" value={zone} onChange={e => setZone(e.target.value)}>
                            <option value="">-- Select Zone --</option>
                            {ZONES.map(z => <option key={z.id} value={z.name}>{z.name}</option>)}
                        </select>
                    </div>

                    {zone === ZONES[0].name && (
                        <div className="form-group">
                            <label className="modal-label">Assign Headmasters (Zone A)</label>
                            <div className="hm-check-list">
                                {HEADMASTERS.filter(h => h.zoneId === 'Z1').map(hm => (
                                    <label key={hm.id} className="hm-check-item">
                                        <input
                                            type="checkbox"
                                            checked={selectedHMs.includes(hm.id)}
                                            onChange={e => {
                                                if (e.target.checked) setSelectedHMs(p => [...p, hm.id]);
                                                else setSelectedHMs(p => p.filter(x => x !== hm.id));
                                            }}
                                        />
                                        <span className="hm-check-name">{hm.name}</span>
                                        <span className="hm-check-school">{hm.school}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="modal-note">
                        <AlertTriangle size={14} /> Once assigned, the DEO will gain access to the zone dashboard.
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button
                        className="btn-assign"
                        disabled={!zone}
                        onClick={() => onSave({ zone, headmasters: selectedHMs })}
                    >
                        <Save size={16} /> Save Assignment
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── CEO Dashboard ────────────────────────────────────────────────────────────
const CEODashboard = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState('overview');
    const [assignments, setAssignments] = useState(getAssignments);
    const [assigningDeo, setAssigningDeo] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const u = localStorage.getItem('user');
        if (u) setUser(JSON.parse(u));
    }, []);

    const handleAssign = (deoId, data) => {
        const updated = { ...assignments, [deoId]: { ...data, assignedAt: new Date().toISOString() } };
        setAssignments(updated);
        saveAssignments(updated);
        setAssigningDeo(null);
    };

    const allDeos = DEOS.map(d => ({
        ...d,
        assignedZone: assignments[d.id]?.zone || d.zone,
        isAssigned: !!(assignments[d.id]?.zone || d.zone),
    }));

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart2 },
        { id: 'deos', label: 'DEO Management', icon: Users },
        { id: 'schools', label: 'Schools', icon: Building2 },
        { id: 'zones', label: 'Zone Analytics', icon: MapPin },
    ];

    return (
        <div className="edu-dashboard">
            {/* ─── Sidebar ─── */}
            <aside className="edu-sidebar blue">
                <div className="edu-brand">
                    <div className="edu-logo"><GraduationCap size={22} color="#fff" /></div>
                    <div>
                        <div className="edu-brand-name">Education Dept.</div>
                        <div className="edu-brand-sys">IACC Portal</div>
                    </div>
                </div>
                <div className="edu-role-tag">Chief Education Officer</div>
                <nav className="edu-nav">
                    {tabs.map(t => {
                        const Icon = t.icon;
                        return (
                            <button key={t.id} className={`edu-nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                                <Icon size={17} />{t.label}
                            </button>
                        );
                    })}
                </nav>
                <div className="edu-sidebar-footer">
                    <div className="edu-user">
                        <div className="edu-avatar">{user?.username?.[0]?.toUpperCase() || 'C'}</div>
                        <div>
                            <div className="edu-username">{user?.username || 'testCEO'}</div>
                            <div className="edu-userrole">CEO – District Admin</div>
                        </div>
                    </div>
                    <button className="edu-logout" onClick={() => { localStorage.clear(); navigate('/login'); }}>
                        <LogOut size={16} />
                    </button>
                </div>
            </aside>

            {/* ─── Main ─── */}
            <main className="edu-main">
                {/* Top Bar */}
                <header className="edu-topbar">
                    <div>
                        <div className="edu-breadcrumb">Education Dept · CEO Dashboard</div>
                        <h1 className="edu-page-title">
                            {tab === 'overview' && 'District Overview'}
                            {tab === 'deos' && 'DEO Management'}
                            {tab === 'schools' && 'School Network'}
                            {tab === 'zones' && 'Zone Analytics'}
                        </h1>
                    </div>
                    <div className="edu-topbar-right">
                        <div className="edu-badge-pill blue">
                            <Shield size={12} />CEO Access
                        </div>
                        <button className="edu-icon-btn"><Bell size={18} /></button>
                    </div>
                </header>

                {/* Hero */}
                <div className="edu-hero blue-hero">
                    <div className="hero-l">
                        <GraduationCap size={36} color="rgba(255,255,255,0.9)" />
                        <div>
                            <div className="hero-title">Namakkal District – Education Department</div>
                            <div className="hero-sub">Academic Year {DISTRICT.year} · {DISTRICT.state}</div>
                        </div>
                    </div>
                    <div className="hero-badges">
                        <span><CheckCircle2 size={13} />System Active</span>
                        <span><Zap size={13} />Automation On</span>
                    </div>
                </div>

                <div className="edu-content">
                    {/* ═══════════════ OVERVIEW ═══════════════ */}
                    {tab === 'overview' && (
                        <>
                            <div className="edu-stats-row">
                                <StatCard icon={Users} label="Total DEOs" value={DISTRICT.totalZones} sub="Across 5 zones" color="#3b82f6" />
                                <StatCard icon={Building2} label="Total Schools" value={DISTRICT.totalSchools.toLocaleString()} sub="Govt + Aided" color="#8b5cf6" />
                                <StatCard icon={GraduationCap} label="Total Students" value={DISTRICT.totalStudents.toLocaleString()} sub="All Classes" color="#10b981" />
                                <StatCard icon={BookOpen} label="Total Teachers" value={DISTRICT.totalTeachers.toLocaleString()} sub="PG + BT Asst." color="#f59e0b" />
                                <StatCard icon={Award} label="Literacy Rate" value={DISTRICT.literacy} sub="District Average" color="#ef4444" />
                                <StatCard icon={TrendingUp} label="SSLC Pass %" value="97.2%" sub="2024–25" color="#06b6d4" />
                            </div>

                            {/* Zone breakdown table */}
                            <div className="edu-card">
                                <div className="edu-card-header">
                                    <h3>Zone-wise Summary</h3>
                                    <button className="edu-tag-btn" onClick={() => setTab('zones')}>View Analytics</button>
                                </div>
                                <table className="edu-table">
                                    <thead>
                                        <tr><th>Zone</th><th>DEO Status</th><th>Schools</th><th>Students</th><th>HMs</th></tr>
                                    </thead>
                                    <tbody>
                                        {ZONES.map((z, i) => {
                                            const deo = allDeos[i];
                                            return (
                                                <tr key={z.id}>
                                                    <td className="fw-500">{z.name}</td>
                                                    <td>
                                                        <span className={`edu-badge ${deo?.isAssigned ? 'green' : 'amber'}`}>
                                                            {deo?.isAssigned ? '✓ Assigned' : '⏳ Pending'}
                                                        </span>
                                                    </td>
                                                    <td>{z.schools}</td>
                                                    <td>{z.students.toLocaleString()}</td>
                                                    <td>{z.headmasters}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Recent activity */}
                            <div className="edu-card">
                                <h3 className="edu-card-title">Recent Activity</h3>
                                <div className="edu-activity">
                                    {[
                                        { t: '2h ago', msg: 'DEO R. Karthikeyan registration received — Pending assignment', type: 'pending' },
                                        { t: '1d ago', msg: 'Board Result 2025 uploaded — SSLC 97.2%, HSC 94.7%', type: 'success' },
                                        { t: '2d ago', msg: 'Inspection report submitted by DEO – Zone B (Rasipuram)', type: 'success' },
                                        { t: '3d ago', msg: 'New school building sanctioned – GHS Valadi', type: 'info' },
                                        { t: '1 week', msg: 'Annual budget allocation released – ₹4.2 Crore', type: 'success' },
                                    ].map((a, i) => (
                                        <div key={i} className="edu-activity-row">
                                            <div className={`edu-dot ${a.type}`} />
                                            <div className="edu-act-content">
                                                <span className="edu-act-msg">{a.msg}</span>
                                                <span className="edu-act-time">{a.t}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ═══════════════ DEO MANAGEMENT ═══════════════ */}
                    {tab === 'deos' && (
                        <div className="edu-card">
                            <div className="edu-card-header">
                                <h3>DEO Roster – All Zones</h3>
                                <span className="edu-tag-info">{allDeos.filter(d => d.isAssigned).length}/{allDeos.length} Assigned</span>
                            </div>
                            <table className="edu-table">
                                <thead>
                                    <tr><th>Name</th><th>Username</th><th>Contact</th><th>Assigned Zone</th><th>Schools</th><th>Status</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {allDeos.map(deo => (
                                        <tr key={deo.id}>
                                            <td>
                                                <div className="edu-name-cell">
                                                    <div className="edu-av blue">{deo.name[0]}</div>
                                                    {deo.name}
                                                </div>
                                            </td>
                                            <td className="mono">{deo.username}</td>
                                            <td>
                                                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                                    <div><Phone size={10} style={{ marginRight: 3 }} />{deo.phone}</div>
                                                    <div><Mail size={10} style={{ marginRight: 3 }} />{deo.email}</div>
                                                </div>
                                            </td>
                                            <td>
                                                {deo.assignedZone
                                                    ? <span style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: 600 }}>{deo.assignedZone}</span>
                                                    : <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Not assigned</span>
                                                }
                                            </td>
                                            <td>{deo.schools || 0}</td>
                                            <td>
                                                <span className={`edu-badge ${deo.isAssigned ? 'green' : 'amber'}`}>
                                                    {deo.isAssigned ? 'Active' : 'Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="edu-assign-btn" onClick={() => setAssigningDeo(deo)}>
                                                    <Edit3 size={13} /> {deo.isAssigned ? 'Reassign' : 'Assign'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ═══════════════ SCHOOLS ═══════════════ */}
                    {tab === 'schools' && (
                        <div className="edu-card">
                            <div className="edu-card-header">
                                <h3>School Network – Zone A (Namakkal Town) Sample</h3>
                                <span className="edu-tag-info">Showing Zone A · {ZONE_A_SCHOOLS.length} schools</span>
                            </div>
                            <table className="edu-table">
                                <thead>
                                    <tr><th>School Name</th><th>Type</th><th>HM Status</th><th>Students</th><th>Teachers</th><th>Pass %</th><th>Aid</th></tr>
                                </thead>
                                <tbody>
                                    {ZONE_A_SCHOOLS.map(s => (
                                        <tr key={s.id}>
                                            <td className="fw-500" style={{ maxWidth: '220px' }}>{s.name}</td>
                                            <td><span className="edu-badge blue">{s.type}</span></td>
                                            <td>
                                                <span className={`edu-badge ${s.hmId ? 'green' : 'amber'}`}>
                                                    {s.hmId ? '✓ Assigned' : '⏳ Vacant'}
                                                </span>
                                            </td>
                                            <td>{s.students}</td>
                                            <td>{s.teachers}</td>
                                            <td>
                                                <div className="edu-progress">
                                                    <div className="edu-progress-bar" style={{ width: `${s.performance}%`, background: s.performance >= 90 ? '#10b981' : s.performance >= 80 ? '#f59e0b' : '#ef4444' }} />
                                                    <span>{s.performance}%</span>
                                                </div>
                                            </td>
                                            <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{s.aidStatus}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ═══════════════ ZONES ═══════════════ */}
                    {tab === 'zones' && (
                        <div className="edu-zones-grid">
                            {ZONES.map((z, i) => {
                                const deo = allDeos[i];
                                const passRate = [94.2, 91.7, 96.3, 88.4, 89.9][i];
                                return (
                                    <div key={z.id} className="edu-zone-card">
                                        <div className="zone-card-header">
                                            <MapPin size={18} color="#3b82f6" />
                                            <h4>{z.name}</h4>
                                        </div>
                                        <div className="zone-stats">
                                            <div><span>Schools</span><strong>{z.schools}</strong></div>
                                            <div><span>Students</span><strong>{z.students.toLocaleString()}</strong></div>
                                            <div><span>HMs</span><strong>{z.headmasters}</strong></div>
                                        </div>
                                        <div className="zone-deo-row">
                                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>DEO:</span>
                                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: deo?.isAssigned ? '#0f172a' : '#94a3b8' }}>
                                                {deo?.name} {!deo?.isAssigned && '(Pending)'}
                                            </span>
                                        </div>
                                        <div className="zone-pass">
                                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Avg Pass Rate:</span>
                                            <span style={{ fontWeight: 700, color: passRate >= 92 ? '#10b981' : '#f59e0b' }}>{passRate}%</span>
                                        </div>
                                        <div className="edu-progress" style={{ marginTop: '0.5rem' }}>
                                            <div className="edu-progress-bar" style={{ width: `${passRate}%`, background: passRate >= 92 ? '#10b981' : '#f59e0b' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* Assign Modal */}
            {assigningDeo && (
                <AssignModal
                    deo={assigningDeo}
                    onClose={() => setAssigningDeo(null)}
                    onSave={(data) => handleAssign(assigningDeo.id, data)}
                />
            )}
        </div>
    );
};

export default CEODashboard;
