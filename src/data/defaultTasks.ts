import type { Task } from '../types';

export const getDefaultTasks = (userId: string): Omit<Task, 'id' | 'created_at' | 'completed_at'>[] => [
    // Personal
    { user_id: userId, title: 'Morning Meditation', category: 'Personal', priority: 'high', effort: 3, is_completed: false, recurrence_type: 'daily' },
    { user_id: userId, title: 'Read 10 Pages', category: 'Personal', priority: 'medium', effort: 3, is_completed: false, recurrence_type: 'daily' },
    { user_id: userId, title: 'Grocery Shopping', category: 'Personal', priority: 'medium', effort: 5, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Journaling', category: 'Personal', priority: 'low', effort: 3, is_completed: false, recurrence_type: 'daily' },
    { user_id: userId, title: 'Workout', category: 'Personal', priority: 'high', effort: 8, is_completed: false, recurrence_type: 'daily' },

    // Professional
    { user_id: userId, title: 'Review Weekly Goals', category: 'Professional', priority: 'high', effort: 5, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Clear Inbox', category: 'Professional', priority: 'medium', effort: 5, is_completed: false, recurrence_type: 'daily' },
    { user_id: userId, title: 'Update project status', category: 'Professional', priority: 'medium', effort: 3, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Team Sync', category: 'Professional', priority: 'medium', effort: 5, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Deep Work Session', category: 'Professional', priority: 'high', effort: 8, is_completed: false, recurrence_type: 'daily' },

    // Digital
    { user_id: userId, title: 'Clean Desktop Files', category: 'Digital', priority: 'low', effort: 3, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Backup Photos', category: 'Digital', priority: 'medium', effort: 5, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Unsubscribe from 3 Newsletters', category: 'Digital', priority: 'low', effort: 3, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Update Software', category: 'Digital', priority: 'high', effort: 3, is_completed: false, recurrence_type: 'monthly' },

    // Relationships
    { user_id: userId, title: 'Call Parents', category: 'Relationships', priority: 'high', effort: 5, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Date Night Planning', category: 'Relationships', priority: 'medium', effort: 5, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Message an old friend', category: 'Relationships', priority: 'low', effort: 3, is_completed: false, recurrence_type: 'monthly' },

    // Misc
    { user_id: userId, title: 'Water Plants', category: 'Misc', priority: 'medium', effort: 3, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Check Tire Pressure', category: 'Misc', priority: 'medium', effort: 3, is_completed: false, recurrence_type: 'monthly' }
];
