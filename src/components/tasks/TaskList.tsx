import { useEffect } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { TaskCard } from './TaskCard';

export function TaskList() {
    const { tasks, isLoading, error, fetchTasks } = useTaskStore();

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    if (isLoading && tasks.length === 0) {
        return <div className="text-center py-8 text-muted">Loading tasks...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    if (tasks.length === 0) {
        return <div className="text-center py-8 text-muted">No tasks yet. Create one above!</div>;
    }

    return (
        <div className="space-y-3">
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
            ))}
        </div>
    );
}
