import { useEffect, useState } from 'react';
import { X, Calendar as CalendarIcon, Repeat } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useTaskStore } from '../../store/useTaskStore';
import type { TaskCategory, RecurrenceType, Priority, Task, EnergyLevel } from '../../types';
import dayjs from 'dayjs';

interface TaskCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskToEdit?: Task | null;
}

type TaskFormData = {
    title: string;
    description: string;
    category: TaskCategory;
    priority: Priority;
    effort: number; // 1-10
    due_date: string;
    recurrence_type: RecurrenceType;
    recurrence_days: number[]; // 1-7
};

export function TaskCreationModal({ isOpen, onClose, taskToEdit }: TaskCreationModalProps) {
    const { addTask, updateTask } = useTaskStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TaskFormData>({
        defaultValues: {
            category: 'Misc',
            priority: 'medium',
            effort: 5,
            recurrence_type: 'none',
            recurrence_days: [],
        }
    });

    // Populate form when editing
    useEffect(() => {
        if (taskToEdit) {
            setValue('title', taskToEdit.title);
            setValue('description', taskToEdit.description || '');
            setValue('category', taskToEdit.category);
            setValue('priority', taskToEdit.priority);
            setValue('effort', taskToEdit.effort);
            setValue('due_date', taskToEdit.due_date ? dayjs(taskToEdit.due_date).format('YYYY-MM-DD') : '');
            setValue('recurrence_type', taskToEdit.recurrence_type);
            setValue('recurrence_days', (taskToEdit.recurrence_value as number[]) || []);
        } else {
            reset();
        }
    }, [taskToEdit, setValue, reset, isOpen]);

    const recurrenceType = watch('recurrence_type');
    const effortValue = watch('effort');

    // close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const onSubmit = async (data: TaskFormData) => {
        setIsSubmitting(true);
        try {
            if (taskToEdit) {
                await updateTask(taskToEdit.id, {
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    priority: data.priority,
                    effort: data.effort as EnergyLevel,
                    due_date: data.due_date || null,
                    recurrence_type: data.recurrence_type,
                    recurrence_value: data.recurrence_type === 'custom' ? data.recurrence_days : undefined,
                });
            } else {
                await addTask({
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    priority: data.priority,
                    effort: data.effort as EnergyLevel,
                    due_date: data.due_date || null,
                    recurrence_type: data.recurrence_type,
                    recurrence_value: data.recurrence_type === 'custom' ? data.recurrence_days : undefined,
                    tags: [],
                    created_at: new Date().toISOString(),
                });
            }
            reset();
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-surface w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-6 shadow-xl animate-in slide-in-from-bottom duration-300 sm:zoom-in-95 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">{taskToEdit ? 'Edit Task' : 'New Task'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted/10 rounded-full">
                        <X className="w-5 h-5 text-muted" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Title & Description */}
                    <div className="space-y-4">
                        <Input
                            label="Task Title"
                            placeholder="What needs to be done?"
                            {...register('title', { required: 'Title is required' })}
                            error={errors.title?.message}
                        />
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-text">Description</label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className="flex w-full rounded-lg border border-muted/30 bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                placeholder="Add details..."
                            />
                        </div>
                    </div>

                    {/* Category & Priority Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-text">Category</label>
                            <select
                                {...register('category')}
                                className="flex h-10 w-full rounded-lg border border-muted/30 bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <option value="Personal">Personal</option>
                                <option value="Professional">Professional</option>
                                <option value="Digital">Digital</option>
                                <option value="Relationships">Relationships</option>
                                <option value="Misc">Misc</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-text">Priority</label>
                            <select
                                {...register('priority')}
                                className="flex h-10 w-full rounded-lg border border-muted/30 bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Effort Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text">Effort Level</label>
                        <div className="space-y-3">
                            <input
                                type="range"
                                min="1"
                                max="10"
                                {...register('effort', { valueAsNumber: true })}
                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="flex justify-between text-xs text-muted">
                                <span>1 - Very Light</span>
                                <span>5 - Moderate</span>
                                <span>10 - Deep Work</span>
                            </div>
                            <div className="text-center text-sm font-medium text-primary">
                                Current: {effortValue}
                            </div>
                        </div>
                    </div>

                    {/* Due Date & Recurrence */}
                    <div className="space-y-4 pt-2 border-t border-muted/10">
                        <div className="flex flex-col gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-text flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4" /> Due Date
                                </label>
                                <input
                                    type="date"
                                    {...register('due_date')}
                                    min={dayjs().format('YYYY-MM-DD')}
                                    className="flex h-10 w-full rounded-lg border border-muted/30 bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-text flex items-center gap-2">
                                    <Repeat className="w-4 h-4" /> Recurrence
                                </label>
                                <select
                                    {...register('recurrence_type')}
                                    className="flex h-10 w-full rounded-lg border border-muted/30 bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                >
                                    <option value="none">None</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="custom">Custom (Select Days)</option>
                                </select>
                            </div>
                        </div>

                        {recurrenceType === 'custom' && (
                            <div className="flex justify-between gap-1">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        //   onClick={() => toggleDay(idx)} // Helper needed for multiselect logic if strictly required, for now placeholder
                                        className="w-8 h-8 rounded-full border border-muted/30 flex items-center justify-center text-xs hover:bg-muted/10"
                                        title="Multi-select not fully wired in simple form yet"
                                    >
                                        {d}
                                    </button>
                                ))}
                                <p className="text-xs text-muted col-span-7 mt-1 ml-1">* Custom days implementation coming soon</p>
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full h-12 text-base" isLoading={isSubmitting}>
                            {taskToEdit ? 'Save Changes' : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
