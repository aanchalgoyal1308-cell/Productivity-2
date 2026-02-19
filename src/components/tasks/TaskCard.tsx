import { useState } from 'react';
import type { Task } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { useTaskStore } from '../../store/useTaskStore';
import { Trash2, CheckCircle, Circle, ChevronDown, ChevronUp, Repeat, Pencil } from 'lucide-react';
import { cn } from '../../utils/cn';
import dayjs from 'dayjs';

interface TaskCardProps {
    task: Task;
    onEdit?: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
    const { toggleTaskCompletion, deleteTask } = useTaskStore();
    const [expanded, setExpanded] = useState(false);

    const priorityColors = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-red-100 text-red-800',
    };

    const categoryColors = {
        Personal: 'bg-purple-100 text-purple-800',
        Professional: 'bg-blue-100 text-blue-800',
        Digital: 'bg-cyan-100 text-cyan-800',
        Relationships: 'bg-rose-100 text-rose-800',
        Misc: 'bg-gray-100 text-gray-800',
    };

    return (
        <Card
            className={cn(
                "transition-all cursor-pointer hover:border-primary/50",
                task.is_completed && "opacity-60"
            )}
            onClick={() => setExpanded(!expanded)}
        >
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskCompletion(task.id, !task.is_completed);
                        }}
                        className="mt-1 text-primary hover:text-primary/80 transition-colors"
                    >
                        {task.is_completed ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <Circle className="w-5 h-5" />
                        )}
                    </button>

                    <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                            <span className={cn("font-medium", task.is_completed && "line-through text-muted")}>
                                {task.title}
                            </span>
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* Category Badge */}
                                <span className={cn("text-[10px] px-2 py-0.5 rounded-full capitalize", categoryColors[task.category] || categoryColors.Misc)}>
                                    {task.category}
                                </span>

                                {/* Priority Badge */}
                                <span className={cn("text-[10px] px-2 py-0.5 rounded-full capitalize", priorityColors[task.priority])}>
                                    {task.priority}
                                </span>

                                {/* Effort Badge */}
                                <span className="text-[10px] bg-muted/20 px-2 py-0.5 rounded-full">
                                    E: {task.effort}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-muted">
                            {task.due_date && (
                                <span>
                                    Due: {dayjs(task.due_date).format("MMM D")}
                                </span>
                            )}
                            {task.recurrence_type !== 'none' && (
                                <span className="flex items-center gap-1">
                                    <Repeat className="w-3 h-3" />
                                    <span className="capitalize">{task.recurrence_type}</span>
                                </span>
                            )}
                        </div>

                        {expanded && task.description && (
                            <p className="text-sm text-muted mt-2 border-t pt-2 border-muted/10">
                                {task.description}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpanded(!expanded);
                            }}
                            className="text-muted hover:text-text p-1"
                        >
                            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(task);
                            }}
                            className="text-muted hover:text-primary p-1"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteTask(task.id);
                            }}
                            className="text-red-400 hover:text-red-500 p-1"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
