import { useState } from 'react';
import type { Task } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { useTaskStore } from '../../store/useTaskStore';
import { Trash2, CheckCircle, Circle, ChevronDown, ChevronUp, Repeat, Pencil } from 'lucide-react';
import { cn } from '../../utils/cn';
import dayjs from 'dayjs';

interface CompactTaskCardProps {
    task: Task;
    onEdit?: (task: Task) => void;
}

export function CompactTaskCard({ task, onEdit }: CompactTaskCardProps) {
    const { toggleTaskCompletion, deleteTask } = useTaskStore();
    const [expanded, setExpanded] = useState(false);

    const priorityColors = {
        low: 'bg-green-500',
        medium: 'bg-yellow-500',
        high: 'bg-red-500',
    };

    const categoryColors = {
        Personal: 'text-purple-600',
        Professional: 'text-blue-600',
        Digital: 'text-cyan-600',
        Relationships: 'text-rose-600',
        Misc: 'text-gray-600',
    };

    return (
        <Card
            className={cn(
                "transition-all cursor-pointer hover:border-primary/50 rounded-lg shadow-sm",
                task.is_completed && "opacity-60"
            )}
            onClick={() => setExpanded(!expanded)}
        >
            <CardContent className="p-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskCompletion(task.id, !task.is_completed);
                        }}
                        className="text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                    >
                        {task.is_completed ? (
                            <CheckCircle className="w-4 h-4" />
                        ) : (
                            <Circle className="w-4 h-4" />
                        )}
                    </button>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <span className={cn("font-medium text-sm truncate", task.is_completed && "line-through text-muted")}>
                                {task.title}
                            </span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {/* Priority Dot */}
                                <div className={cn("w-2 h-2 rounded-full", priorityColors[task.priority])}></div>
                                {/* Category */}
                                <span className={cn("text-xs capitalize", categoryColors[task.category] || categoryColors.Misc)}>
                                    {task.category}
                                </span>
                                {/* Effort */}
                                <span className="text-xs bg-muted/20 px-1.5 py-0.5 rounded text-muted">
                                    {task.effort}
                                </span>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {expanded && (
                            <div className="mt-2 pt-2 border-t border-muted/10 space-y-1 animate-in slide-in-from-top-1 duration-200">
                                {task.description && (
                                    <p className="text-sm text-muted">
                                        {task.description}
                                    </p>
                                )}
                                <div className="flex items-center gap-3 text-xs text-muted">
                                    {task.due_date && (
                                        <span>
                                            Due: {dayjs(task.due_date).format("MMM D, YYYY")}
                                        </span>
                                    )}
                                    {task.recurrence_type !== 'none' && (
                                        <span className="flex items-center gap-1">
                                            <Repeat className="w-3 h-3" />
                                            <span className="capitalize">{task.recurrence_type}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 flex-shrink-0">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpanded(!expanded);
                            }}
                            className="text-muted hover:text-text p-0.5"
                        >
                            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(task);
                            }}
                            className="text-muted hover:text-primary p-0.5"
                        >
                            <Pencil className="w-3 h-3" />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteTask(task.id);
                            }}
                            className="text-red-400 hover:text-red-500 p-0.5"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}