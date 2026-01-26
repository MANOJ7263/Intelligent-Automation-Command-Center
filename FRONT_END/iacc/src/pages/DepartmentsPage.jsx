import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, FileText, TrendingUp, ArrowRight } from 'lucide-react';

const DepartmentsPage = () => {
    const departments = [
        { name: 'Revenue', staff: 45, tasks: 1250, efficiency: 94, color: 'blue' },
        { name: 'Health', staff: 62, tasks: 3400, efficiency: 98, color: 'emerald' },
        { name: 'Education', staff: 38, tasks: 890, efficiency: 88, color: 'amber' },
        { name: 'Administration', staff: 25, tasks: 450, efficiency: 92, color: 'purple' },
        { name: 'Transport', staff: 30, tasks: 670, efficiency: 85, color: 'cyan' },
        { name: 'Public Works', staff: 55, tasks: 1100, efficiency: 90, color: 'orange' },
    ];

    const getTheme = (color) => {
        const themes = {
            blue: { bg: 'bg-blue-500', lightBg: 'bg-blue-100', text: 'text-blue-600', icon: 'text-blue-600' },
            emerald: { bg: 'bg-emerald-500', lightBg: 'bg-green-100', text: 'text-green-600', icon: 'text-green-600' },
            amber: { bg: 'bg-amber-500', lightBg: 'bg-blue-100', text: 'text-orange-600', icon: 'text-orange-600' }, // fallback for amber/orange grouping
            purple: { bg: 'bg-purple-500', lightBg: 'bg-indigo-50', text: 'text-purple-600', icon: 'text-purple-600' },
            cyan: { bg: 'bg-cyan-500', lightBg: 'bg-blue-100', text: 'text-cyan-600', icon: 'text-cyan-600' },
            orange: { bg: 'bg-orange-500', lightBg: 'bg-red-100', text: 'text-orange-600', icon: 'text-orange-600' }
        };
        return themes[color] || themes['blue'];
    };

    return (
        <div className="space-y-8 p-1 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <h2 className="text-responsive-xl text-gradient tracking-tight">Departments</h2>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Overview of department performance and automation adoption.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {departments.map((dept, index) => {
                    const theme = getTheme(dept.color);
                    return (
                        <div key={dept.name} className="stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
                            <Card className="card-enhanced hover-lift border-0 overflow-hidden cursor-pointer group">
                                <div className={`h-1.5 w-full ${theme.bg}`} />
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex justify-between items-center">
                                        <span className="text-xl">{dept.name}</span>
                                        <div className={`p-2 rounded-lg ${theme.lightBg}`}>
                                            <Building2 className={`h-6 w-6 ${theme.icon}`} />
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                <Users className="h-3.5 w-3.5" /> Staff
                                            </p>
                                            <p className="text-2xl font-bold">{dept.staff}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                <FileText className="h-3.5 w-3.5" /> Tasks
                                            </p>
                                            <p className="text-2xl font-bold">{dept.tasks.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                            <span className="text-green-600">{dept.efficiency}% Efficiency</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DepartmentsPage;
