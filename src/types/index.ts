export type Priority = 'low' | 'medium' | 'high';
export type EnergyLevel = 1 | 2 | 3 | 4 | 5;
export type TaskCategory = 'Personal' | 'Digital' | 'Relationships' | 'Professional' | 'Misc';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface UserProfile {
    id: string; // UUID
    email: string;
    display_name?: string;
    created_at: string;
    preferences?: UserPreferences;
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    daily_energy_reset_time: string; // "04:00"
}

export interface Task {
    id: string;
    user_id: string;
    title: string;
    description: string;
    priority: Priority;
    effort: EnergyLevel;
    due_date?: string | null; // ISO 8601
    category: TaskCategory;
    recurrence_type: RecurrenceType;
    recurrence_value?: number[]; // For custom days e.g. [1, 3, 5]
    is_completed: boolean;
    completed_at?: string | null;
    created_at: string;
    project_id?: string;
    tags?: string[];
}

export interface EnergyLog {
    id: string;
    user_id: string;
    date: string; // YYYY-MM-DD
    level: EnergyLevel;
    notes?: string;
    timestamp: string;
}

export interface Project {
    id: string;
    user_id: string;
    name: string;
    color?: string;
    created_at: string;
}

// Deterministic compression from 1-10 to 1-5 scale
export function compressToFiveScale(oldEnergy: number): EnergyLevel {
    if (oldEnergy <= 2) return 1;
    if (oldEnergy <= 4) return 2;
    if (oldEnergy <= 6) return 3;
    if (oldEnergy <= 8) return 4;
    return 5;
}
