import type { Task, EnergyLevel } from '../types';

export interface TaskSelectionResult {
    tasks: Task[];
    daily: Task[];
    suggested: Task[];
}

// Configuration for targets based on Energy Level
const ENERGY_TARGETS: Record<number, { easy: number; medium: number; hard: number }> = {
    1: { easy: 1, medium: 0, hard: 0 },
    2: { easy: 2, medium: 0, hard: 0 },
    3: { easy: 1, medium: 1, hard: 0 },
    4: { easy: 2, medium: 1, hard: 0 },
    5: { easy: 1, medium: 2, hard: 0 },
    6: { easy: 0, medium: 1, hard: 1 },
    7: { easy: 0, medium: 2, hard: 1 },
    8: { easy: 0, medium: 2, hard: 2 },
    9: { easy: 0, medium: 2, hard: 2 },
    10: { easy: 0, medium: 1, hard: 3 },
};

// Main function
export function filterTasksByEnergy(tasks: Task[], energyLevel: EnergyLevel): TaskSelectionResult {
    // 1. Active tasks
    const activeTasks = tasks.filter(t => !t.is_completed);

    // 2. Separate daily tasks
    const daily = activeTasks.filter(t => t.recurrence_type === 'daily');
    const pool = activeTasks.filter(t => t.recurrence_type !== 'daily');

    // 3. Classify by effort
    const getEffort = (t: Task) => Number(t.effort) || 0;

    const easyTasks = pool.filter(t => getEffort(t) <= 3);
    const mediumTasks = pool.filter(t => getEffort(t) >= 4 && getEffort(t) <= 6);
    const hardTasks = pool.filter(t => getEffort(t) >= 7);

    // 4. Sort each pool
    const sortedEasy = sortTasks([...easyTasks]);
    const sortedMedium = sortTasks([...mediumTasks]);
    const sortedHard = sortTasks([...hardTasks]);

    // 5. Determine targets
    const targets = ENERGY_TARGETS[energyLevel] || { easy: 1, medium: 0, hard: 0 };
    let { easy: targetEasy, medium: targetMedium, hard: targetHard } = targets;

    // 6. Selection & fallback
    const selected: Task[] = [];

    // Easy
    const selectedEasy = sortedEasy.slice(0, targetEasy);
    selected.push(...selectedEasy);
    const missingEasy = targetEasy - selectedEasy.length;
    if (missingEasy > 0) targetMedium += missingEasy;

    // Medium
    const selectedMedium = sortedMedium.slice(0, targetMedium);
    selected.push(...selectedMedium);
    const missingMedium = targetMedium - selectedMedium.length;
    if (missingMedium > 0) targetHard += missingMedium;

    // Hard
    const selectedHard = sortedHard.slice(0, targetHard);
    selected.push(...selectedHard);
    const missingHard = targetHard - selectedHard.length;
    if (missingHard > 0) {
        const extraMediumNeeded = missingHard * 2;
        const remainingMedium = sortedMedium.slice(targetMedium);
        const extraMedium = remainingMedium.slice(0, extraMediumNeeded);
        selected.push(...extraMedium);
    }

    return {
        tasks: activeTasks,
        daily: sortTasks(daily),
        suggested: sortTasks(selected),
    };
}

// Helper: Sort tasks by due date, then priority
function sortTasks(list: Task[]): Task[] {
    return list.sort((a, b) => {
        // Due date
        if (a.due_date && b.due_date) {
            return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        }
        if (a.due_date) return -1;
        if (b.due_date) return 1;

        // Priority
        const priorityScore: Record<string, number> = { high: 3, medium: 2, low: 1 };
        const aScore = priorityScore[a.priority] || 0;
        const bScore = priorityScore[b.priority] || 0;
        return bScore - aScore;
    });
}