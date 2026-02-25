import type { Task } from '../types';

export const getDefaultTasks = (userId: string): Omit<Task, 'id' | 'created_at' | 'completed_at'>[] => [
    // Personal (1 daily, 3 weekly, 3 monthly, 3 none)
    { user_id: userId, title: 'Buy new workwear', description: 'Preferably do it on a desktop', category: 'Personal', priority: 'low', effort: 1, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Practice Face yoga', description: 'NA', category: 'Personal', priority: 'low', effort: 1, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Go to gym', description: 'NA', category: 'Personal', priority: 'medium', effort: 2, is_completed: false, recurrence_type: 'daily' },
    { user_id: userId, title: 'Deep clean 1 appliance/cabinet', description: 'Other options: Cupboard, old cabinets', category: 'Personal', priority: 'medium', effort: 4, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Review household inventory', description: 'Groceries, Toileteries, Supplements, Misc', category: 'Personal', priority: 'high', effort: 3, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Declutter wardrobe', description: 'Clothes. Shoes. Others', category: 'Personal', priority: 'medium', effort: 4, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Walk 12000 steps', description: 'NA', category: 'Personal', priority: 'low', effort: 2, is_completed: false, recurrence_type: 'daily' },
    { user_id: userId, title: 'Plan weekly & monthly meals', description: 'Organize healthy eating', category: 'Personal', priority: 'medium', effort: 4, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Deep clean room', description: 'Maintain living space', category: 'Personal', priority: 'low', effort: 5, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Throw away expired items', description: 'NA', category: 'Personal', priority: 'low', effort: 2, is_completed: false, recurrence_type: 'none' },

    // Professional (1 daily, 3 weekly, 3 monthly, 3 none)
    { user_id: userId, title: 'Read about React + Vite', description: 'Resources:', category: 'Professional', priority: 'high', effort: 4, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Complete Vibe coding course', description: 'Links:', category: 'Professional', priority: 'low', effort: 3, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Map user journey of MOOD', description: 'Notes', category: 'Professional', priority: 'high', effort: 4, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Create a product case study for MOOD', description: 'Document progress', category: 'Professional', priority: 'high', effort: 4, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Complete MVP of the app', description: 'Notes', category: 'Professional', priority: 'medium', effort: 5, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Complete 1 chapter of HTML course', description: 'Learn new tools', category: 'Professional', priority: 'high', effort: 4, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Plan content for the week', description: 'Assess objectives', category: 'Professional', priority: 'medium', effort: 4, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Batch shoot/edit content', description: 'Link', category: 'Professional', priority: 'high', effort: 5, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Practice SQL queries', description: 'Resources:', category: 'Professional', priority: 'medium', effort: 4, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Finish app deployment on Vercel', description: 'Plan long-term', category: 'Professional', priority: 'high', effort: 4, is_completed: false, recurrence_type: 'none' },

    // Digital (1 daily, 3 weekly, 3 monthly, 3 none)
    { user_id: userId, title: 'Review auto-debit subscriptions', description: 'Gpay/all PSPs, Banks, investment apps', category: 'Digital', priority: 'high', effort: 1, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Clean up spam from gallery', description: 'in phone and backed up', category: 'Digital', priority: 'medium', effort: 2, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Clean up desktop/phone display', description: 'remove clutther from all folders', category: 'Digital', priority: 'medium', effort: 2, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Unsubscribe from spam emails', description: 'all emails', category: 'Digital', priority: 'low', effort: 2, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Deep declutter Google drive', description: 'check files/videos/audios/images', category: 'Digital', priority: 'medium', effort: 3, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Create weekly planning template on Notion', description: 'NA', category: 'Digital', priority: 'medium', effort: 4, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Review monthly expenses - update tracker', description: 'NA', category: 'Digital', priority: 'medium', effort: 4, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Re-organise Notion dashboard', description: 'Add anything new if needed/ re-order', category: 'Digital', priority: 'medium', effort: 5, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Reduce inbox to only important emails', description: 'all inboxes', category: 'Digital', priority: 'medium', effort: 5, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Categorise important documents in phone', description: 'Personal documents/ Resumes/ etc', category: 'Digital', priority: 'medium', effort: 5, is_completed: false, recurrence_type: 'monthly' },

    // Relationships (4 weekly, 3 monthly, 3 none)
    { user_id: userId, title: 'Brainstorm birthday gift ideas', description: 'for husband & parents', category: 'Relationships', priority: 'low', effort: 2, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Call family', description: 'Catch up with relatives', category: 'Relationships', priority: 'low', effort: 1, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Plan date night', description: 'Schedule quality time', category: 'Relationships', priority: 'low', effort: 2, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Prepare travel calendar with husband', description: 'Progress so far:', category: 'Relationships', priority: 'medium', effort: 4, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Plan a proper date', description: 'Shortlist:', category: 'Relationships', priority: 'low', effort: 3, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Plan housewarming party', description: 'Requirements:', category: 'Relationships', priority: 'medium', effort: 2, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Sort our parents finances & policies', description: 'NA', category: 'Relationships', priority: 'medium', effort: 4, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Book concert tickets', description: 'Dates', category: 'Relationships', priority: 'medium', effort: 2, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Family gathering', description: 'Host or attend event', category: 'Relationships', priority: 'low', effort: 5, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Relationship counseling', description: 'Seek professional advice', category: 'Relationships', priority: 'low', effort: 5, is_completed: false, recurrence_type: 'monthly' },

    // Misc (4 weekly, 3 monthly, 3 none)
    { user_id: userId, title: 'Brainstorm birthday gift ideas', description: 'for husband', category: 'Misc', priority: 'low', effort: 3, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Plan next trip itinerary', description: 'details', category: 'Misc', priority: 'medium', effort: 3, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Prepare travel calendar with husband', description: 'Progress:', category: 'Misc', priority: 'medium', effort: 4, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Repair item', description: 'Fix something broken', category: 'Misc', priority: 'low', effort: 4, is_completed: false, recurrence_type: 'weekly' },
    { user_id: userId, title: 'Organize closet', description: 'Declutter space', category: 'Misc', priority: 'medium', effort: 5, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Grocery shopping', description: 'Buy essentials', category: 'Misc', priority: 'medium', effort: 4, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Car maintenance', description: 'Service vehicle', category: 'Misc', priority: 'medium', effort: 4, is_completed: false, recurrence_type: 'monthly' },
    { user_id: userId, title: 'Buy warm lights for house', description: 'Upgrade living area', category: 'Misc', priority: 'high', effort: 5, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Plan vacation', description: 'Arrange travel', category: 'Misc', priority: 'medium', effort: 5, is_completed: false, recurrence_type: 'none' },
    { user_id: userId, title: 'Learn new hobby', description: 'Explore interests', category: 'Misc', priority: 'low', effort: 5, is_completed: false, recurrence_type: 'none' },
];
