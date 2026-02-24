import type { Task, EnergyLevel } from '../types';

export interface TaskSelectionResult {
    tasks: Task[];
    daily: Task[];
    suggested: Task[];
}

// Configuration for targets based on Energy Level
const ENERGY_TARGETS: Record<number, { easy: number; medium: number; hard: number }> = {
    1: { easy: 0, medium: 0, hard: 0 },
    2: { easy: 0, medium: 0, hard: 0 },
    3: { easy: 0, medium: 0, hard: 0 },
    4: { easy: 2, medium: 1, hard: 0 },
    5: { easy: 1, medium: 2, hard: 0 },
    6: { easy: 0, medium: 1, hard: 1 },
    7: { easy: 0, medium: 2, hard: 1 },
    8: { easy: 0, medium: 2, hard: 2 },
    9: { easy: 0, medium: 2, hard: 2 },
    10: { easy: 0, medium: 1, hard: 3 },
};

// Get task distribution for an energy level
export function getTaskDistribution(energy: EnergyLevel): { easy: number; medium: number; hard: number } {
    return ENERGY_TARGETS[energy] || { easy: 0, medium: 0, hard: 0 };
}

// Main function
export function filterTasksByEnergy(tasks: Task[], energyLevel: EnergyLevel): TaskSelectionResult {
    // 1. Active tasks
    const allActive = tasks.filter(t => !t.is_completed);

    // 2. Separate daily tasks (with effort <= energyLevel)
    const daily = allActive.filter(t => t.recurrence_type === 'daily' && t.effort <= energyLevel);
    const sortedDaily = sortTasks(daily).slice(0, 3);

    // 3. Pool for suggested: non-daily, effort <= energyLevel
    const pool = allActive.filter(t => t.recurrence_type !== 'daily' && t.effort <= energyLevel);

    // 3. Classify by effort (Easy 1-3, Medium 4-7, Hard 8-10)
    const easyTasks = pool.filter(t => t.effort >= 1 && t.effort <= 3);
    const mediumTasks = pool.filter(t => t.effort >= 4 && t.effort <= 7);
    const hardTasks = pool.filter(t => t.effort >= 8 && t.effort <= 10);

    // 4. Sort each pool by priority desc, due date asc (null last), effort asc
    const sortedEasy = sortTasks(easyTasks);
    const sortedMedium = sortTasks(mediumTasks);
    const sortedHard = sortTasks(hardTasks);

    // 5. Determine targets
    const targets = ENERGY_TARGETS[energyLevel] || { easy: 0, medium: 0, hard: 0 };

    // 6. Selection (no fallback, exact quota)
    const selected: Task[] = [];

    // Easy
    selected.push(...sortedEasy.slice(0, targets.easy));

    // Medium
    selected.push(...sortedMedium.slice(0, targets.medium));

    // Hard
    selected.push(...sortedHard.slice(0, targets.hard));

    console.log(`[filterTasksByEnergy] Energy ${energyLevel}: Daily ${sortedDaily.length}, Suggested ${selected.length} (${targets.easy} easy, ${targets.medium} medium, ${targets.hard} hard)`);

    return {
        tasks: allActive,
        daily: sortedDaily,
        suggested: selected,
    };
}

// Helper: Sort tasks by priority desc, due date asc (null last), effort asc
function sortTasks(list: Task[]): Task[] {
    return list.sort((a, b) => {
        // Priority desc: high > medium > low
        const priorityScore: Record<string, number> = { high: 3, medium: 2, low: 1 };
        const aScore = priorityScore[a.priority] || 0;
        const bScore = priorityScore[b.priority] || 0;
        if (aScore !== bScore) return bScore - aScore;

        // Due date asc, null last
        if (a.due_date && b.due_date) {
            return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        }
        if (a.due_date) return -1;
        if (b.due_date) return 1;

        // Effort asc
        return a.effort - b.effort;
    });
}