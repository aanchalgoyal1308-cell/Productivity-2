import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';
import { useTaskStore } from '../store/useTaskStore';
import { useEnergyStore } from '../store/useEnergyStore';
import { EnergySlider } from '../components/energy/EnergySlider';
import { TaskCard } from '../components/tasks/TaskCard';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import { TaskCreationModal } from '../components/tasks/TaskCreationModal';
import { filterTasksByEnergy } from '../utils/energyAlgo';
import { Card, CardContent } from '../components/ui/Card';
import { Loader2 } from 'lucide-react';

export default function Home() {
    const { tasks, fetchTasks, isLoading: tasksLoading } = useTaskStore();
    const { todayLog, fetchTodayLog, isLoading: energyLoading } = useEnergyStore();

    const [activeTab, setActiveTab] = useState<'focus' | 'all' | 'history'>('focus');
    const [dailyPlan, setDailyPlan] = useState<{ date: string, taskIds: string[] } | null>(null);
    const [shuffleUsed, setShuffleUsed] = useState(false);
    const [historyFilter, setHistoryFilter] = useState<'24h' | '7d' | '30d'>('24h');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchTasks();
        fetchTodayLog();
    }, [fetchTasks, fetchTodayLog]);

    // Load Daily Plan from LocalStorage
    useEffect(() => {
        const storedPlan = localStorage.getItem('daily_plan');
        const storedShuffle = localStorage.getItem('daily_shuffle_used');
        const todayStr = new Date().toDateString();

        if (storedPlan) {
            const parsed = JSON.parse(storedPlan);
            if (parsed.date === todayStr) {
                setDailyPlan(parsed);
                if (storedShuffle === todayStr) {
                    setShuffleUsed(true);
                }
                return;
            }
        }

        // If no plan or old plan, we wait for energy log to generate one
    }, []);

    // Generate Plan if Energy Log exists and no plan for today
    useEffect(() => {
        if (!todayLog || tasks.length === 0) return;

        const todayStr = new Date().toDateString();
        // If we already have a plan for today, don't overwrite
        if (dailyPlan && dailyPlan.date === todayStr) return;

        // Generate Plan
        const suggested = filterTasksByEnergy(tasks, todayLog.level).slice(0, 5);
        const newPlan = {
            date: todayStr,
            taskIds: suggested.map(t => t.id)
        };

        localStorage.setItem('daily_plan', JSON.stringify(newPlan));
        // Reset shuffle for new day
        localStorage.removeItem('daily_shuffle_used');
        setDailyPlan(newPlan);
        setShuffleUsed(false);

    }, [todayLog, tasks, dailyPlan]);

    const handleShuffle = () => {
        if (!todayLog || shuffleUsed) return;

        // Simple shuffle: filter again, maybe slice differently or just randomize order of top 10 and pick 5
        // For MVP: just re-run filter and maybe randomize the top 10
        const candidates = filterTasksByEnergy(tasks, todayLog.level).slice(0, 10);
        // Fisher-Yates shuffle
        for (let i = candidates.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
        }
        const newSelection = candidates.slice(0, 5);

        const newPlan = {
            date: new Date().toDateString(),
            taskIds: newSelection.map(t => t.id)
        };

        localStorage.setItem('daily_plan', JSON.stringify(newPlan));
        localStorage.setItem('daily_shuffle_used', new Date().toDateString());
        setDailyPlan(newPlan);
        setShuffleUsed(true);
    };

    const isLoading = tasksLoading || energyLoading;

    // Derived Lists
    const focusTasks = dailyPlan
        ? tasks.filter(t => dailyPlan.taskIds.includes(t.id))
            // Maintain order from plan if possible, or just list. 
            // To maintain order we can sort by index in taskIds
            .sort((a, b) => dailyPlan.taskIds.indexOf(a.id) - dailyPlan.taskIds.indexOf(b.id))
        : [];

    // If some tasks in plan were deleted, they won't show. That's fine.

    const allActiveTasks = tasks.filter(t => !t.is_completed);

    const historyTasks = tasks.filter(t => {
        if (!t.is_completed || !t.completed_at) return false;
        const completedDate = new Date(t.completed_at);
        const now = new Date();
        const diffMs = now.getTime() - completedDate.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        const diffDays = diffHours / 24;

        if (historyFilter === '24h') return diffHours <= 24;
        if (historyFilter === '7d') return diffDays <= 7;
        if (historyFilter === '30d') return diffDays <= 30;
        return false;
    }).sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime());

    return (
        <div className="space-y-6 pb-20">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-primary">Good Morning!</h1>
                <p className="text-muted text-sm">Let's align your work with your energy.</p>
            </div>

            {/* Top Tabs */}
            <div className="flex p-1 bg-muted/10 rounded-lg w-full">
                {['focus', 'all', 'history'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={cn(
                            "flex-1 py-2 rounded-md text-sm font-medium transition-all capitalize",
                            activeTab === tab ? "bg-white shadow-sm text-primary" : "text-muted hover:text-text"
                        )}
                    >
                        {tab === 'all' ? 'All Tasks' : tab}
                    </button>
                ))}
            </div>

            {activeTab === 'focus' && (
                <>
                    <EnergySlider />

                    {todayLog ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    Today's Plan
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                        {focusTasks.length}
                                    </span>
                                </h2>
                                {!shuffleUsed && (
                                    <button
                                        onClick={handleShuffle}
                                        className="text-xs text-primary underline hover:text-primary/80"
                                    >
                                        Shuffle (1 Use)
                                    </button>
                                )}
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                            ) : focusTasks.length > 0 ? (
                                <div className="space-y-3">
                                    {focusTasks.map(task => (
                                        <TaskCard key={task.id} task={task} />
                                    ))}
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="p-6 text-center text-muted">
                                        No suggested tasks found. Add more tasks to your library!
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    ) : (
                        !isLoading && (
                            <Card className="bg-muted/5 border-dashed">
                                <CardContent className="p-6 text-center text-muted">
                                    Log your energy above to generate your daily plan.
                                </CardContent>
                            </Card>
                        )
                    )}
                </>
            )}

            {activeTab === 'all' && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Active Tasks</h2>
                    <div className="space-y-3">
                        {allActiveTasks.length > 0 ? (
                            allActiveTasks.map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))
                        ) : (
                            <p className="text-muted text-center py-8">No active tasks.</p>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="space-y-4">
                    <div className="flex gap-2">
                        {(['24h', '7d', '30d'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setHistoryFilter(f)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-xs border transition-colors",
                                    historyFilter === f
                                        ? "bg-primary text-white border-primary"
                                        : "bg-surface border-muted/30 text-muted"
                                )}
                            >
                                Last {f}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {historyTasks.length > 0 ? (
                            historyTasks.map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))
                        ) : (
                            <p className="text-muted text-center py-8">No completed tasks in this period.</p>
                        )}
                    </div>
                </div>
            )}

            <FloatingActionButton onClick={() => setIsModalOpen(true)} />

            <TaskCreationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
