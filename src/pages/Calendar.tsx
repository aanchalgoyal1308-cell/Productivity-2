import { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTaskStore } from '../store/useTaskStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';
import dayjs from 'dayjs';

export default function Calendar() {
    const { tasks } = useTaskStore();
    const [currentDate, setCurrentDate] = useState(dayjs());

    const startOfMonth = currentDate.startOf('month');
    const startDay = startOfMonth.day(); // 0 is Sunday
    const daysInMonth = currentDate.daysInMonth();

    const days = [];
    // Empty slots for prev month
    for (let i = 0; i < startDay; i++) {
        days.push(null);
    }
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
    const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'));
    const resetToToday = () => setCurrentDate(dayjs());

    const getTasksForDay = (day: number) => {
        const dateStr = currentDate.date(day).format('YYYY-MM-DD');
        return tasks.filter(t => t.due_date && t.due_date.startsWith(dateStr));
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-primary">Calendar</h1>
                <Button size="sm" variant="ghost" onClick={resetToToday}>Today</Button>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={prevMonth} className="p-1 hover:bg-muted/10 rounded">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-semibold text-lg">
                            {currentDate.format('MMMM YYYY')}
                        </span>
                        <button onClick={nextMonth} className="p-1 hover:bg-muted/10 rounded">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                            <div key={d} className="text-xs text-muted font-medium py-1">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, idx) => {
                            if (!day) return <div key={`empty-${idx}`} className="aspect-square" />;

                            const dayTasks = getTasksForDay(day);
                            const isToday = dayjs().isSame(currentDate.date(day), 'day');

                            return (
                                <div
                                    key={day}
                                    className={cn(
                                        "aspect-square rounded-lg border border-transparent flex flex-col items-center justify-start pt-1 cursor-pointer transition-colors hover:border-primary/50",
                                        isToday && "bg-primary/10 text-primary font-bold border-primary/20"
                                    )}
                                >
                                    <span className="text-sm">{day}</span>
                                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center px-1">
                                        {dayTasks.slice(0, 3).map(t => (
                                            <div
                                                key={t.id}
                                                className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    t.is_completed ? "bg-muted" :
                                                        t.priority === 'high' ? "bg-red-400" :
                                                            t.priority === 'medium' ? "bg-yellow-400" : "bg-green-400"
                                                )}
                                            />
                                        ))}
                                        {dayTasks.length > 3 && (
                                            <span className="text-[8px] leading-none text-muted">+</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <p className="text-center text-xs text-muted">
                Select a date to view detailed tasks (coming soon)
            </p>
        </div>
    );
}
