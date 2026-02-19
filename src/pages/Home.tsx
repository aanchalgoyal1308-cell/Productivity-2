import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';
import { useTaskStore } from '../store/useTaskStore';
import { useEnergyStore } from '../store/useEnergyStore';
import { EnergySlider } from '../components/energy/EnergySlider';
import { TaskCard } from '../components/tasks/TaskCard';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import { TaskCreationModal } from '../components/tasks/TaskCreationModal';
import { Card, CardContent } from '../components/ui/Card';
import { Loader2 } from 'lucide-react';
import { useDailyPlan } from '../hooks/useDailyPlan';
import { EmptyLibrary } from '../components/home/EmptyLibrary';

export default function Home() {
    const { tasks, fetchTasks, isLoading: tasksLoading } = useTaskStore();
    const { todayLog, fetchTodayLog, isLoading: energyLoading } = useEnergyStore();

    // UI State
    const [activeTab, setActiveTab] = useState<'focus' | 'history'>('focus');
    const [historyFilter, setHistoryFilter] = useState<'24h' | '7d' | '30d'>('24h');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        fetchTasks();
        fetchTodayLog();
    }, [fetchTasks, fetchTodayLog]);

    // Daily Plan Logic Hook
    const { dailyPlan, shuffleUsed, handleShuffle } = useDailyPlan(tasks, todayLog);

    const isLoading = tasksLoading || energyLoading;

    // Derived Lists
    const focusTasks = dailyPlan
        ? tasks.filter(t => dailyPlan.dailyIds.includes(t.id) || dailyPlan.suggestedIds.includes(t.id))
            // Sort: Daily first, then Suggested (in order)
            .sort((a, b) => {
                const isADaily = dailyPlan.dailyIds.includes(a.id);
                const isBDaily = dailyPlan.dailyIds.includes(b.id);
                if (isADaily && !isBDaily) return -1;
                if (!isADaily && isBDaily) return 1;

                // If both suggested, use order in suggestedIds
                if (!isADaily && !isBDaily) {
                    return dailyPlan.suggestedIds.indexOf(a.id) - dailyPlan.suggestedIds.indexOf(b.id);
                }
                return 0; // Both daily, keep existing order (or sort by priority?)
            })
        : [];

    // Split for rendering headers
    const dailyRoutineTasks = focusTasks.filter(t => dailyPlan?.dailyIds.includes(t.id));
    const suggestedFocusTasks = focusTasks.filter(t => dailyPlan?.suggestedIds.includes(t.id));

    const historyTasks = tasks.filter(t => {
        if (!t.is_completed || !t.completed_at) return false;
        const completedDate = new Date(t.completed_at);
        const now = new Date();
        const diffHours = (now.getTime() - completedDate.getTime()) / (1000 * 60 * 60);
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
                {['focus', 'history'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={cn(
                            "flex-1 py-2 rounded-md text-sm font-medium transition-all capitalize",
                            activeTab === tab ? "bg-white shadow-sm text-primary" : "text-muted hover:text-text"
                        )}
                    >
                        {tab}
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
                            ) : (
                                <div className="space-y-6">
                                    {/* Daily Routine Section */}
                                    {dailyRoutineTasks.length > 0 && (
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Daily Routine</h3>
                                            <div className="space-y-3">
                                                {dailyRoutineTasks.map(task => (
                                                    <TaskCard key={task.id} task={task} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Suggested Focus Section */}
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Suggested Focus</h3>
                                        {suggestedFocusTasks.length > 0 ? (
                                            <div className="space-y-3">
                                                {suggestedFocusTasks.map(task => (
                                                    <TaskCard key={task.id} task={task} />
                                                ))}
                                            </div>
                                        ) : (
                                            <Card>
                                                <CardContent className="p-6 text-center text-muted">
                                                    No suggested tasks found for this energy level.
                                                    <br />
                                                    <span className="text-xs opacity-70">Try adding more tasks with matching effort levels!</span>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                </div>
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

            {/* Empty State / Demo Data Button */}
            {tasks.length === 0 && !isLoading && <EmptyLibrary />}

            <TaskCreationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
