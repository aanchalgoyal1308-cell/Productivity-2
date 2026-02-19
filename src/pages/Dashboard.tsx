import { useTaskStore } from '../store/useTaskStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useEffect } from 'react';

export default function Dashboard() {
    const { tasks, fetchTasks } = useTaskStore();

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const completedCount = tasks.filter(t => t.is_completed).length;
    const pendingCount = tasks.filter(t => !t.is_completed).length;

    const priorityDistribution = [
        { name: 'High', count: tasks.filter(t => t.priority === 'high').length, color: '#F87171' },
        { name: 'Medium', count: tasks.filter(t => t.priority === 'medium').length, color: '#FACC15' },
        { name: 'Low', count: tasks.filter(t => t.priority === 'low').length, color: '#4ADE80' },
    ];

    return (
        <div className="space-y-6 pb-20">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-primary">Insights</h1>
                <p className="text-muted text-sm">Track your progress and energy trends.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold text-primary">{completedCount}</p>
                        <p className="text-sm text-muted">Completed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold text-text">{pendingCount}</p>
                        <p className="text-sm text-muted">Pending</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Task Priorities</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={priorityDistribution}>
                            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                {priorityDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
