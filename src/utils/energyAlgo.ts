import type { Task, EnergyLevel } from '../types';

interface TaskSelectionResult {
    daily: Task[];
    suggested: Task[];
}

// Configuration for targets based on Energy Level
// [Easy, Medium, Hard]
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

export function filterTasksByEnergy(tasks: Task[], energyLevel: EnergyLevel): TaskSelectionResult {
    const activeTasks = tasks.filter(t => !t.is_completed);

    // 1. Separate Daily Tasks
    const daily = activeTasks.filter(t => t.recurrence_type === 'daily');
    const pool = activeTasks.filter(t => t.recurrence_type !== 'daily');

    // 2. Classify Effort (Safe Parsing)
    const getEffort = (t: Task) => Number(t.effort) || 0;

    const easyTasks = pool.filter(t => getEffort(t) <= 3);
    const mediumTasks = pool.filter(t => getEffort(t) >= 4 && getEffort(t) <= 6);
    const hardTasks = pool.filter(t => getEffort(t) >= 7);

    console.log(`[EnergyAlgo] Energy: ${energyLevel}`);
    console.log(`[EnergyAlgo] Pool Sizes - Easy: ${easyTasks.length}, Med: ${mediumTasks.length}, Hard: ${hardTasks.length}`);

    // Sort pools
    const sortedEasy = sortTasks([...easyTasks]);
    const sortedMedium = sortTasks([...mediumTasks]);
    const sortedHard = sortTasks([...hardTasks]);

    // 3. Determine Targets
    // Default to strict lowest if undefined level
    const targets = ENERGY_TARGETS[energyLevel] || { easy: 1, medium: 0, hard: 0 };
    let { easy: targetEasy, medium: targetMedium, hard: targetHard } = targets;

    console.log(`[EnergyAlgo] Targets - Easy: ${targetEasy}, Med: ${targetMedium}, Hard: ${targetHard}`);

    // 4. Selection & Fallback Logic
    const selected: Task[] = [];

    // Step A: Select Easy
    const selectedEasy = sortedEasy.slice(0, targetEasy);
    selected.push(...selectedEasy);

    // Fallback: Easy shortage -> Medium
    const missingEasy = targetEasy - selectedEasy.length;
    if (missingEasy > 0) {
        console.log(`[EnergyAlgo] Falback: ${missingEasy} Easy -> Medium`);
        targetMedium += missingEasy;
    }

    // Step B: Select Medium
    const selectedMedium = sortedMedium.slice(0, targetMedium);
    selected.push(...selectedMedium);

    // Fallback: Medium shortage -> Hard
    const missingMedium = targetMedium - selectedMedium.length;
    if (missingMedium > 0) {
        console.log(`[EnergyAlgo] Fallback: ${missingMedium} Medium -> Hard`);
        targetHard += missingMedium;
    }

    // Step C: Select Hard
    const selectedHard = sortedHard.slice(0, targetHard);
    selected.push(...selectedHard);

    // Fallback: Hard shortage -> 2x Medium
    const missingHard = targetHard - selectedHard.length;
    if (missingHard > 0) {
        console.log(`[EnergyAlgo] Fallback: ${missingHard} Hard -> 2x Medium`);
        const extraMediumNeeded = missingHard * 2;

        // Get remaining mediums (those not already picked)
        // Since sortedMedium is sorted, and we took the first N, the rest are valid fallback candidates
        const remainingMedium = sortedMedium.slice(targetMedium);

        const extraMedium = remainingMedium.slice(0, extraMediumNeeded);
        selected.push(...extraMedium);
    }

    console.log(`[EnergyAlgo] Selected Total: ${selected.length}`);

    return {
        daily: sortTasks(daily),
        suggested: sortTasks(selected)
    };
}

// Helper: Sort by Due Date, then Priority
function sortTasks(list: Task[]): Task[] {
    return list.sort((a, b) => {
        // 1. Due Date
        if (a.due_date && b.due_date) {
            return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        }
        if (a.due_date) return -1;
        if (b.due_date) return 1;

        // 2. Priority
        const priorityScore = { high: 3, medium: 2, low: 1 };
        if (priorityScore[a.priority] !== priorityScore[b.priority]) {
            return priorityScore[b.priority] - priorityScore[a.priority];
        }
        return 0;
    });
}
