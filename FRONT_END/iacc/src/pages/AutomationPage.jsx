import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, Play, Pause, RefreshCw, Settings, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AutomationPage = () => {
    const bots = [
        { id: 'BOT-001', name: 'Invoice Processor', status: 'running', uptime: '99.8%', tasks: 1240, type: 'Financial' },
        { id: 'BOT-002', name: 'Email Classifier', status: 'running', uptime: '99.9%', tasks: 850, type: 'Communication' },
        { id: 'BOT-003', name: 'Data Validator', status: 'paused', uptime: '95.5%', tasks: 420, type: 'Data Quality' },
        { id: 'BOT-004', name: 'Compliance Checker', status: 'error', uptime: '92.1%', tasks: 115, type: 'Audit' },
        { id: 'BOT-005', name: 'Report Generator', status: 'idle', uptime: '98.2%', tasks: 300, type: 'Reporting' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'running': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'paused': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'error': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-8 p-1 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <h2 className="text-responsive-xl text-gradient tracking-tight">Automation Bots</h2>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Manage and monitor your fleet of intelligent automation bots.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bots.map((bot, index) => (
                    <div key={bot.id} className="stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
                        <Card className="card-enhanced hover-lift border-0">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                    {bot.name}
                                </CardTitle>
                                <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase flex items-center gap-1.5 ${getStatusColor(bot.status)}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${bot.status === 'running' ? 'bg-green-500 animate-pulse' : bot.status === 'error' ? 'bg-red-500' : 'bg-current'}`} />
                                    {bot.status}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 mt-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Bot ID</span>
                                        <span className="font-mono font-medium">{bot.id}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Tasks Processed</span>
                                        <span className="font-bold">{bot.tasks.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Uptime</span>
                                        <span className="font-medium text-green-600">{bot.uptime}</span>
                                    </div>

                                    <div className="pt-4 flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1 gap-2 hover:bg-slate-50">
                                            {bot.status === 'running' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                            {bot.status === 'running' ? 'Pause' : 'Start'}
                                        </Button>
                                        <Button variant="outline" size="sm" className="px-3 hover:bg-slate-50">
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="px-3 hover:bg-slate-50">
                                            <RefreshCw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}

                {/* Add New Bot Card */}
                <div className="stagger-item" style={{ animationDelay: '0.6s' }}>
                    <button className="w-full h-full min-h-[250px] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300">
                        <div className="p-4 rounded-full bg-slate-100">
                            <Bot className="h-8 w-8" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-lg">Deploy New Bot</h3>
                            <p className="text-sm">Configure a new automation agent</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AutomationPage;
