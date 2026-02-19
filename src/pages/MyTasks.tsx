import { useState, useEffect } from 'react';
import { TaskCreationModal } from '../components/tasks/TaskCreationModal';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import { useTaskStore } from '../store/useTaskStore';
import { useEnergyStore } from '../store/useEnergyStore';
import { filterTasksByEnergy } from '../utils/energyAlgo';
import type { TaskCategory, Task } from '../types';
import { cn } from '../utils/cn';
import { TaskCard } from '../components/tasks/TaskCard';
import { Button } from '../components/ui/Button';

export default function MyTasks() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterMode, setFilterMode] = useState<'category' | 'energy'>('category');
    const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'All'>('All');
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    const { tasks, fetchTasks } = useTaskStore();
    const { todayLog } = useEnergyStore();

    useEffect(() => {
        const init = async () => {
            await fetchTasks();
            const currentTasks = useTaskStore.getState().tasks;
            if (currentTasks.length === 0) {
                await useTaskStore.getState().seedDefaults();
            }
        };
        init();
    }, [fetchTasks]);

    // CATEGORY FILTER
    const categories: (TaskCategory | 'All')[] = ['All', 'Personal', 'Professional', 'Digital', 'Relationships', 'Misc'];

    // FILTER LOGIC
    let filteredTasks = tasks;

    if (filterMode === 'energy' && todayLog) {
        filteredTasks = filterTasksByEnergy(tasks, todayLog.level);
    } else if (filterMode === 'category' && selectedCategory !== 'All') {
        filteredTasks = tasks.filter(t => t.category === selectedCategory);
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-primary">Task Library</h1>
                <p className="text-muted text-sm">Manage your backlog and active tasks.</p>
            </div>

            {/* Filter Controls */}
            <div className="space-y-3">
                <div className="flex p-1 bg-muted/10 rounded-lg w-fit">
                    <button
                        onClick={() => setFilterMode('category')}
                        className={cn(
                            "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                            filterMode === 'category' ? "bg-white shadow-sm text-primary" : "text-muted hover:text-text"
                        )}
                    >
                        By Category
                    </button>
                    <button
                        onClick={() => setFilterMode('energy')}
                        className={cn(
                            "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                            filterMode === 'energy' ? "bg-white shadow-sm text-primary" : "text-muted hover:text-text"
                        )}
                    >
                        By Energy
                    </button>
                </div>

                {filterMode === 'category' && (
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs border whitespace-nowrap transition-colors",
                                    selectedCategory === cat
                                        ? "bg-primary text-white border-primary"
                                        : "bg-surface border-muted/30 text-muted hover:border-primary/50"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {filterMode === 'energy' && !todayLog && (
                    <div className="text-sm text-muted bg-yellow-50 p-2 rounded text-center">
                        Log your energy on the Home screen to see filtered results!
                    </div>
                )}
            </div>

            {/* Task List */}
            <div className="space-y-6">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-muted mb-4">No tasks found.</p>
                        {filterMode === 'category' && selectedCategory === 'All' && (
                            <Button
                                variant="outline"
                                onClick={async () => {
                                    await useTaskStore.getState().seedDefaults();
                                }}
                            >
                                Load Sample Tasks
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Grouping Logic for "All" Category View */}
                        {selectedCategory === 'All' ? (
                            categories.filter(c => c !== 'All').map(cat => {
                                const catTasks = filteredTasks.filter(t => t.category === cat);
                                if (catTasks.length === 0) return null;
                                return (
                                    <div key={cat} className="space-y-3">
                                        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider pl-1">
                                            {cat}
                                        </h3>
                                        <div className="space-y-3">
                                            {catTasks.map(task => (
                                                <TaskCard
                                                    key={task.id}
                                                    task={task}
                                                    onEdit={(t) => {
                                                        setTaskToEdit(t);
                                                        setIsModalOpen(true);
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            // Flat list for specific filters
                            <div className="space-y-3">
                                {filteredTasks.map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onEdit={(t) => {
                                            setTaskToEdit(t);
                                            setIsModalOpen(true);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            <FloatingActionButton onClick={() => {
                setTaskToEdit(null);
                setIsModalOpen(true);
            }} />

            <TaskCreationModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setTaskToEdit(null);
                }}
                taskToEdit={taskToEdit}
            />
        </div>
    );
}
