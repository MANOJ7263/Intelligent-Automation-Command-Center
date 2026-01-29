import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';

const AdminAssignTaskPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        department: 'HEALTH', // Default
        priority: 'HIGH'
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8080/api/tasks/delegate', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(`Task "${response.data.title}" successfully delegated to ${response.data.department} department.`);
            setFormData({ title: '', description: '', department: 'HEALTH', priority: 'HIGH' });
        } catch (err) {
            setError(err.response?.data || 'Failed to delegate task');
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Global Task Delegation
            </h1>

            <Card className="w-full max-w-2xl bg-white border-slate-200 shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                <CardHeader className="bg-slate-50 border-b border-slate-200">
                    <CardTitle className="text-slate-800">Assign Task to Department</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    {message && (
                        <Alert className="bg-green-100 border-green-200 text-green-700">
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}
                    {error && (
                        <Alert className="bg-red-100 border-red-200 text-red-700">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="title" className="text-slate-600 font-semibold">Task Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 mt-1"
                                placeholder="e.g., Conduct Safety Audit"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="description" className="text-slate-600 font-semibold">Description / Instructions</Label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full min-h-[100px] rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                                placeholder="Provide detailed instructions..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="department" className="text-slate-600 font-semibold">Target Department</Label>
                                <select
                                    id="department"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full h-10 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                                >
                                    <option value="HEALTH">Health</option>
                                    <option value="REVENUE">Revenue</option>
                                    <option value="EDUCATION">Education</option>
                                    <option value="TRANSPORT">Transport</option>
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="priority" className="text-slate-600 font-semibold">Priority</Label>
                                <select
                                    id="priority"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full h-10 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                                >
                                    <option value="HIGH">High</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="LOW">Low</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-transform hover:scale-[1.02]">
                                Delegate Task
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminAssignTaskPage;
