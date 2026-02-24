import type { Task } from '../types';

export const getDefaultTasks = (userId: string): Omit<Task, 'id' | 'created_at' | 'completed_at'>[] => [
    // Personal (1 daily, 3 weekly, 3 monthly, 3 none)
    { user_id: userId, title: 'Drink water', description: 'Stay hydrated throughout the day', category: 'Personal', priority: 'low', effort: 1, is_completed: false, recurrence_type: 'daily' },
    { user_id: userId, title: 'Stretch for 5 minutes', description: 'Quick morning stretch', category: 'Personal', priority: 'medium', effort: 2, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Read a book chapter', description: 'Expand your knowledge', category: 'Personal', priority: 'medium', effort: 3, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Cook a healthy meal', description: 'Prepare nutritious food', category: 'Personal', priority: 'medium', effort: 4, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Meditate', description: 'Practice mindfulness', category: 'Personal', priority: 'high', effort: 5, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Go for a walk', description: 'Enjoy fresh air', category: 'Personal', priority: 'medium', effort: 6, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Journal thoughts', description: 'Reflect on the day', category: 'Personal', priority: 'low', effort: 7, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Plan weekly meals', description: 'Organize healthy eating', category: 'Personal', priority: 'medium', effort: 8, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Deep clean room', description: 'Maintain living space', category: 'Personal', priority: 'low', effort: 9, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Exercise routine', description: 'Full workout session', category: 'Personal', priority: 'high', effort: 10, is_completed: false, recurrence_type: 'none' },

    // Professional (1 daily, 3 weekly, 3 monthly, 3 none)
    { user_id: userId, title: 'Check emails', description: 'Review inbox', category: 'Professional', priority: 'medium', effort: 1, is_completed: false, recurrence_type: 'daily' },
    { user_id: userId, title: 'Update to-do list', description: 'Organize tasks', category: 'Professional', priority: 'low', effort: 2, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Attend meeting', description: 'Team discussion', category: 'Professional', priority: 'high', effort: 3, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Write report', description: 'Document progress', category: 'Professional', priority: 'medium', effort: 4, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Network online', description: 'Connect with peers', category: 'Professional', priority: 'medium', effort: 5, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Skill training', description: 'Learn new tools', category: 'Professional', priority: 'high', effort: 6, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Review goals', description: 'Assess objectives', category: 'Professional', priority: 'medium', effort: 7, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Client call', description: 'Discuss project', category: 'Professional', priority: 'high', effort: 8, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Budget planning', description: 'Financial review', category: 'Professional', priority: 'medium', effort: 9, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Strategy session', description: 'Plan long-term', category: 'Professional', priority: 'high', effort: 10, is_completed: false, recurrence_type: 'none' },

    // Digital (1 daily, 3 weekly, 3 monthly, 3 none)
    { user_id: userId, title: 'Organize files', description: 'Sort digital documents', category: 'Digital', priority: 'low', effort: 1, is_completed: false, recurrence_type: 'daily' },
    { user_id: userId, title: 'Update passwords', description: 'Secure accounts', category: 'Digital', priority: 'medium', effort: 2, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Backup data', description: 'Save important files', category: 'Digital', priority: 'medium', effort: 3, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Learn coding', description: 'Practice programming', category: 'Digital', priority: 'high', effort: 4, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Design mockup', description: 'Create visual concepts', category: 'Digital', priority: 'medium', effort: 5, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Video editing', description: 'Edit media content', category: 'Digital', priority: 'high', effort: 6, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'SEO optimization', description: 'Improve website ranking', category: 'Digital', priority: 'medium', effort: 7, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'App development', description: 'Build software features', category: 'Digital', priority: 'high', effort: 8, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Data analysis', description: 'Interpret metrics', category: 'Digital', priority: 'medium', effort: 9, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'System upgrade', description: 'Enhance infrastructure', category: 'Digital', priority: 'high', effort: 10, is_completed: false, recurrence_type: 'none' },

    // Relationships (4 weekly, 3 monthly, 3 none)
    { user_id: userId, title: 'Text a friend', description: 'Send a quick message', category: 'Relationships', priority: 'low', effort: 1, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Call family', description: 'Catch up with relatives', category: 'Relationships', priority: 'medium', effort: 2, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Plan date night', description: 'Schedule quality time', category: 'Relationships', priority: 'medium', effort: 3, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Write thank you note', description: 'Express gratitude', category: 'Relationships', priority: 'low', effort: 4, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Volunteer work', description: 'Help community', category: 'Relationships', priority: 'high', effort: 5, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Attend social event', description: 'Network socially', category: 'Relationships', priority: 'medium', effort: 6, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Mentor someone', description: 'Guide others', category: 'Relationships', priority: 'high', effort: 7, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Reconnect with old friend', description: 'Renew connections', category: 'Relationships', priority: 'medium', effort: 8, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Family gathering', description: 'Host or attend event', category: 'Relationships', priority: 'high', effort: 9, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Relationship counseling', description: 'Seek professional advice', category: 'Relationships', priority: 'high', effort: 10, is_completed: false, recurrence_type: 'none' },

    // Misc (4 weekly, 3 monthly, 3 none)
    { user_id: userId, title: 'Water plants', description: 'Care for greenery', category: 'Misc', priority: 'low', effort: 1, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Clean kitchen', description: 'Maintain cleanliness', category: 'Misc', priority: 'medium', effort: 2, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Pay bills', description: 'Handle finances', category: 'Misc', priority: 'medium', effort: 3, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Repair item', description: 'Fix something broken', category: 'Misc', priority: 'low', effort: 4, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Organize closet', description: 'Declutter space', category: 'Misc', priority: 'medium', effort: 5, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Grocery shopping', description: 'Buy essentials', category: 'Misc', priority: 'medium', effort: 6, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Car maintenance', description: 'Service vehicle', category: 'Misc', priority: 'high', effort: 7, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Home improvement', description: 'Upgrade living area', category: 'Misc', priority: 'high', effort: 8, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Plan vacation', description: 'Arrange travel', category: 'Misc', priority: 'medium', effort: 9, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Learn new hobby', description: 'Explore interests', category: 'Misc', priority: 'low', effort: 10, is_completed: false, recurrence_type: 'none' },
];
