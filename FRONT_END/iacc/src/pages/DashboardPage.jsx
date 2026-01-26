import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Clock, CheckCircle, AlertTriangle, Terminal, TrendingUp, Zap, Shield } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: '08:00', tasks: 12, automated: 10 },
    { name: '10:00', tasks: 19, automated: 15 },
    { name: '12:00', tasks: 35, automated: 32 },
    { name: '14:00', tasks: 28, automated: 25 },
    { name: '16:00', tasks: 45, automated: 40 },
    { name: '18:00', tasks: 20, automated: 18 },
];

const DashboardPage = () => {
    const stats = [
        {
            title: "Active Tasks",
            value: "24",
            icon: Clock,
            gradient: "from-blue-500 to-cyan-500",
            desc: "+2 since last hour",
            trend: "+12%"
        },
        {
            title: "Automation Success",
            value: "98.5%",
            icon: CheckCircle,
            gradient: "from-emerald-500 to-teal-500",
            desc: "Best performance this week",
            trend: "+5.2%"
        },
        {
            title: "Risk Alerts",
            value: "3",
            icon: AlertTriangle,
            gradient: "from-orange-500 to-red-500",
            desc: "Requires attention",
            trend: "-2"
        },
        {
            title: "System Health",
            value: "Optimal",
            icon: Activity,
            gradient: "from-purple-500 to-pink-500",
            desc: "All systems operational",
            trend: "100%"
        },
    ];

    return (
        <div className="space-y-8 p-1">
            {/* Header Section */}
            <div className="slide-in-bottom">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2 text-gradient">
                            Command Room
                        </h1>
                        <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
                            Real-time monitoring of District IACC operations
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="badge-glow" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
                        }}>
                            <span style={{
                                position: 'relative',
                                display: 'flex',
                                height: '8px',
                                width: '8px',
                                marginRight: '0.5rem'
                            }}>
                                <span className="pulse-dot" style={{
                                    position: 'absolute',
                                    display: 'inline-flex',
                                    height: '100%',
                                    width: '100%',
                                    borderRadius: '9999px',
                                    background: 'rgba(255, 255, 255, 0.75)',
                                }}></span>
                                <span style={{
                                    position: 'relative',
                                    display: 'inline-flex',
                                    borderRadius: '9999px',
                                    height: '8px',
                                    width: '8px',
                                    background: 'white'
                                }}></span>
                            </span>
                            Live System
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <div
                        key={stat.title}
                        className="stagger-item stat-card card-enhanced hover-lift"
                        style={{
                            background: 'var(--card)',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    >
                        {/* Gradient Top Border */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: `linear-gradient(to right, ${stat.gradient.replace('from-', '#').replace(' to-', ', #').replace('-500', '')})`
                        }}></div>

                        <div style={{ padding: '1.5rem' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '1rem'
                            }}>
                                <p style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: 'var(--muted-foreground)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {stat.title}
                                </p>
                                <div style={{
                                    padding: '0.75rem',
                                    borderRadius: '0.75rem',
                                    background: `linear-gradient(135deg, ${stat.gradient.replace('from-', 'rgba(').replace(' to-', ', 0.1), rgba(').replace('-500', ', 0.05)')})`
                                }}>
                                    <stat.icon style={{
                                        height: '1.5rem',
                                        width: '1.5rem',
                                        color: stat.gradient.includes('blue') ? '#3b82f6' :
                                            stat.gradient.includes('emerald') ? '#10b981' :
                                                stat.gradient.includes('orange') ? '#f59e0b' : '#a855f7'
                                    }} />
                                </div>
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <div style={{
                                    fontSize: '2.25rem',
                                    fontWeight: '700',
                                    lineHeight: '1',
                                    marginBottom: '0.5rem'
                                }}>
                                    {stat.value}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem'
                                }}>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        padding: '0.125rem 0.5rem',
                                        borderRadius: '9999px',
                                        background: stat.trend.includes('-') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                        color: stat.trend.includes('-') ? '#ef4444' : '#10b981',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        <TrendingUp style={{ height: '0.75rem', width: '0.75rem', marginRight: '0.25rem' }} />
                                        {stat.trend}
                                    </span>
                                    <span style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem' }}>
                                        {stat.desc}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-7">
                {/* Main Chart */}
                <div className="lg:col-span-4 slide-in-left">
                    <div className="card-enhanced" style={{
                        background: 'var(--card)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        overflow: 'hidden'
                    }}>
                        <div style={{ padding: '1.5rem', paddingBottom: '1rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <h3 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    marginBottom: '0.25rem'
                                }}>
                                    Productivity Trends
                                </h3>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--muted-foreground)'
                                }}>
                                    Task Volume vs Automation (Today)
                                </p>
                            </div>
                            <div className="chart-container" style={{ height: '320px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="var(--muted-foreground)"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="var(--muted-foreground)"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'var(--card)',
                                                borderRadius: '0.75rem',
                                                border: '1px solid var(--border)',
                                                boxShadow: 'var(--shadow-lg)',
                                                padding: '0.75rem'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="tasks"
                                            stroke="#667eea"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorTasks)"
                                            name="Total Tasks"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="automated"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorAuto)"
                                            name="Automated"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="lg:col-span-3 slide-in-right">
                    <div className="card-enhanced" style={{
                        background: 'var(--card)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        height: '100%'
                    }}>
                        <div style={{ padding: '1.5rem', paddingBottom: '1rem' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '1rem'
                            }}>
                                <div style={{
                                    padding: '0.5rem',
                                    borderRadius: '0.5rem',
                                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
                                    marginRight: '0.75rem'
                                }}>
                                    <Terminal style={{ height: '1.25rem', width: '1.25rem', color: '#6366f1' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                                        Live System Logs
                                    </h3>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                                        Real-time orchestrator feed
                                    </p>
                                </div>
                            </div>
                            <div className="enhanced-scrollbar" style={{
                                maxHeight: '320px',
                                overflowY: 'auto',
                                paddingRight: '0.5rem'
                            }}>
                                {[
                                    { bot: 'Bot_#4591', task: 'Invoice generation completed for Dept_Revenue', time: '12:31:05', status: 'success' },
                                    { bot: 'Bot_#4592', task: 'Data validation in progress for Dept_Health', time: '12:32:05', status: 'progress' },
                                    { bot: 'Bot_#4593', task: 'Report compilation completed for Dept_Education', time: '12:33:05', status: 'success' },
                                    { bot: 'Bot_#4594', task: 'Error handling initiated for Dept_Transport', time: '12:34:05', status: 'error' },
                                    { bot: 'Bot_#4595', task: 'Backup process completed successfully', time: '12:35:05', status: 'success' },
                                ].map((log, i) => (
                                    <div
                                        key={i}
                                        className="timeline-item"
                                        style={{
                                            marginBottom: '1rem',
                                            padding: '1rem',
                                            borderRadius: '0.5rem',
                                            background: log.status === 'success' ? 'rgba(16, 185, 129, 0.05)' :
                                                log.status === 'error' ? 'rgba(239, 68, 68, 0.05)' :
                                                    'rgba(59, 130, 246, 0.05)',
                                            border: '1px solid',
                                            borderColor: log.status === 'success' ? 'rgba(16, 185, 129, 0.2)' :
                                                log.status === 'error' ? 'rgba(239, 68, 68, 0.2)' :
                                                    'rgba(59, 130, 246, 0.2)',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    marginBottom: '0.25rem'
                                                }}>
                                                    <span style={{
                                                        fontSize: '0.875rem',
                                                        fontWeight: '600',
                                                        fontFamily: 'JetBrains Mono, monospace'
                                                    }}>
                                                        {log.bot}
                                                    </span>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        width: '6px',
                                                        height: '6px',
                                                        borderRadius: '50%',
                                                        background: log.status === 'success' ? '#10b981' :
                                                            log.status === 'error' ? '#ef4444' : '#3b82f6'
                                                    }}></span>
                                                </div>
                                                <p style={{
                                                    fontSize: '0.8125rem',
                                                    color: 'var(--muted-foreground)',
                                                    lineHeight: '1.5'
                                                }}>
                                                    {log.task}
                                                </p>
                                            </div>
                                            <span className="font-mono" style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--muted-foreground)',
                                                whiteSpace: 'nowrap',
                                                marginLeft: '1rem'
                                            }}>
                                                {log.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
