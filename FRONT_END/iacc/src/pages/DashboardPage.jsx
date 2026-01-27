import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { taskService } from '@/services/api';
import { Activity, Clock, CheckCircle, AlertTriangle, Terminal, TrendingUp, Zap, Shield, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: '08:00', tasks: 12, automated: 10 },
    { name: '10:00', tasks: 19, automated: 15 },
    { name: '12:00', tasks: 35, automated: 32 },
    { name: '14:00', tasks: 28, automated: 25 },
    { name: '16:00', tasks: 45, automated: 40 },
    { name: '18:00', tasks: 20, automated: 18 },
];

const HighRiskEscalation = () => {
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        try {
            const data = await taskService.getAllTasks();
            setTasks(data.filter(t => t.riskLevel === 'HIGH' && t.status !== 'COMPLETED' && t.status !== 'ESCALATED'));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { fetchTasks(); }, []);

    const handleEscalate = async (id) => {
        try {
            await taskService.escalateTask(id);
            fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

    if (tasks.length === 0) return null;

    return (
        <div className="mt-8 slide-in-bottom">
            <h3 className="text-xl font-bold mb-4 text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" /> High-Risk Escalation Center
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map(task => (
                    <Card key={task.id} className="border-red-200 bg-red-50/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base text-red-900">{task.title}</CardTitle>
                            <CardDescription className="text-red-700 font-medium">{task.department}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-red-600 mb-4">{task.risk_reason || "Critical task requiring attention"}</p>
                            <Button variant="destructive" size="sm" className="w-full" onClick={() => handleEscalate(task.id)}>
                                🚨 Escalate & Force Automation
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const [summary, setSummary] = useState({
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
        highRiskTasks: 0
    });

    const handleExport = async () => {
        try {
            await taskService.downloadReport();
        } catch (error) {
            console.error("Export failed", error);
            alert("Failed to export report.");
        }
    };

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await taskService.getCollectorSummary();
                setSummary(data);
            } catch (error) {
                console.error("Failed to fetch summary", error);
            }
        };
        fetchSummary();
    }, []);

    const stats = [
        { title: "Total Tasks", value: summary.totalTasks, icon: Activity, trend: "+12%", color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Completed", value: summary.completedTasks, icon: CheckCircle, trend: "+5%", color: "text-green-600", bg: "bg-green-50" },
        { title: "High Risk", value: summary.highRiskTasks, icon: AlertTriangle, trend: "-2%", color: "text-red-600", bg: "bg-red-50" },
        { title: "Pending", value: summary.pendingTasks, icon: Clock, trend: "+8%", color: "text-orange-600", bg: "bg-orange-50" },
    ];

    return (
        <div className="space-y-8 p-1 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight mb-2 text-gradient">
                        Collector Dashboard
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Operational oversight and high-priority escalations.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={handleExport}>
                        <Download className="h-4 w-4" /> Export Report
                    </Button>
                    <Button className="gap-2 bg-slate-900 hover:bg-slate-800">
                        <Terminal className="h-4 w-4" /> System Console
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="card-enhanced hover-lift border-l-4" style={{ borderLeftColor: stat.color.replace('text-', '').replace('-600', '') }}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${stat.bg}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className={stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                                    {stat.trend}
                                </span> from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <HighRiskEscalation />

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-7">
                {/* Main Chart */}
                <div className="lg:col-span-4 slide-in-left">
                    <Card className="card-enhanced h-full">
                        <CardHeader>
                            <CardTitle>Productivity Trends</CardTitle>
                            <CardDescription>Task Volume vs Automation (Today)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[320px] w-full">
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
                                        <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '0.75rem', border: '1px solid var(--border)' }} />
                                        <Area type="monotone" dataKey="tasks" stroke="#667eea" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" name="Total Tasks" />
                                        <Area type="monotone" dataKey="automated" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAuto)" name="Automated" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Live Automation Monitor */}
                <div className="lg:col-span-3 slide-in-right">
                    <AutomationMonitor />
                </div>
            </div>
        </div>
    );
};

const AutomationMonitor = () => {
    const [jobs, setJobs] = useState([]);

    const fetchJobs = async () => {
        try {
            const data = await taskService.getAutomationStatus();
            setJobs(data);
        } catch (error) {
            console.error("Failed to fetch automation status", error);
        }
    };

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const handleRetry = async (id) => {
        try {
            await taskService.retryTask(id);
            fetchJobs();
        } catch (error) {
            console.error("Retry failed", error);
        }
    };

    return (
        <Card className="card-enhanced h-full">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-indigo-500" />
                    <div>
                        <CardTitle>Live Automation Monitor</CardTitle>
                        <CardDescription>Real-time UiPath Orchestrator Feed</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 enhanced-scrollbar">
                    {jobs.length === 0 ? (
                        <div className="text-center text-sm text-slate-500 py-8">No active automation jobs</div>
                    ) : (
                        jobs.map((job) => (
                            <div key={job.id} className={`flex items-start justify-between p-3 rounded-lg border ${job.uipathJobStatus === 'Successful' ? 'bg-green-50/50 border-green-100' :
                                    ['Faulted', 'Start Failed', 'FAILED'].includes(job.uipathJobStatus) ? 'bg-red-50/50 border-red-100' :
                                        'bg-blue-50/50 border-blue-100'
                                }`}>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono font-bold text-slate-700">
                                            {job.assignedBotType || "Unassigned Bot"}
                                        </span>
                                        <span className={`h-1.5 w-1.5 rounded-full ${job.uipathJobStatus === 'Successful' ? 'bg-green-500' :
                                                ['Faulted', 'Start Failed', 'FAILED'].includes(job.uipathJobStatus) ? 'bg-red-500' : 'bg-blue-500 animate-pulse'
                                            }`} />
                                    </div>
                                    <p className="text-xs text-slate-600 truncate max-w-[200px]" title={job.title}>{job.title}</p>
                                    <p className="text-[10px] text-slate-400">Status: {job.uipathJobStatus || "Pending"}</p>
                                </div>

                                {['Faulted', 'Start Failed', 'FAILED'].includes(job.uipathJobStatus) ? (
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-100" onClick={() => handleRetry(job.id)} title="Retry Automation">
                                        <Zap className="h-3 w-3" />
                                    </Button>
                                ) : (
                                    <span className="text-[10px] font-mono text-slate-400">
                                        {new Date(job.createdAt).toLocaleTimeString()}
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default DashboardPage;
