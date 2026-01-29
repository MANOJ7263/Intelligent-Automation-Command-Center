import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const AdminDepartmentsPage = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock initial data structure
    const departments = [
        { name: 'Health', id: 'HEALTH', color: 'text-green-500', bg: 'bg-green-500/10' },
        { name: 'Revenue', id: 'REVENUE', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Education', id: 'EDUCATION', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { name: 'Transport', id: 'TRANSPORT', color: 'text-purple-500', bg: 'bg-purple-500/10' }
    ];

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/tasks/analytics', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalytics(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch analytics', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-white">Loading Department Data...</div>;
    }

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Department Health Overview
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {departments.map((dept) => (
                    <Card key={dept.id} className="bg-white border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className={`h-1.5 w-full ${dept.bg.replace('/10', '')}`} />
                        <CardHeader className="pb-2">
                            <CardTitle className={`flex items-center gap-2 ${dept.color}`}>
                                <Activity size={20} />
                                {dept.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 text-sm font-medium">Status</span>
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                                        Operational
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-100">
                                        <div className="text-2xl font-bold text-slate-800">{analytics?.totalTasks || 0}<span className="text-slate-400 text-xs ml-1">*</span></div>
                                        <div className="text-xs text-slate-500 font-medium">Total Tasks</div>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-100">
                                        <div className="text-2xl font-bold text-amber-500">{analytics?.pendingTasks || 0}<span className="text-slate-400 text-xs ml-1">*</span></div>
                                        <div className="text-xs text-slate-500 font-medium">Pending</div>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400 mt-2 text-center italic">
                                    * Global stats (Breakdown coming soon)
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-8">
                <Card className="bg-white border-red-200 shadow-lg overflow-hidden">
                    <div className="h-1 bg-red-500"></div>
                    <CardHeader className="bg-red-50 border-b border-red-100">
                        <CardTitle className="text-red-700 flex items-center gap-2">
                            <AlertTriangle size={20} /> System Wide Alert Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <AlertTriangle className="text-red-600 h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-slate-800">High Risk Tasks Detected</div>
                                <div className="text-sm text-slate-500">{analytics?.highRiskTasks || 0} tasks require immediate attention</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDepartmentsPage;
