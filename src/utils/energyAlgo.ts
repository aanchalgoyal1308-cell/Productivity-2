import type { Task, EnergyLevel } from '../types';

interface TaskSelectionResult {
    daily: Task[];
    suggested: Task[];
}

export function filterTasksByEnergy(tasks: Task[], energyLevel: EnergyLevel): TaskSelectionResult {
    const activeTasks = tasks.filter(t => !t.is_completed);

    // 1. Separate Daily Tasks
    const daily = activeTasks.filter(t => t.recurrence_type === 'daily');
    const pool = activeTasks.filter(t => t.recurrence_type !== 'daily');

    // 2. Classify Effort
    const easyTasks = pool.filter(t => t.effort <= 3);
    const mediumTasks = pool.filter(t => t.effort >= 4 && t.effort <= 6);
    const hardTasks = pool.filter(t => t.effort >= 7);

    console.log(`[EnergyAlgo] Energy: ${energyLevel}`);
    console.log(`[EnergyAlgo] Pool Sizes - Easy: ${easyTasks.length}, Med: ${mediumTasks.length}, Hard: ${hardTasks.length}`);

    // Helper to sort by priority/due_date
    const sortTasks = (list: Task[]) => {
        return list.sort((a, b) => {
            if (a.due_date && b.due_date) {
                return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
            }
            if (a.due_date) return -1;
            if (b.due_date) return 1;

            const priorityScore = { high: 3, medium: 2, low: 1 };
            if (priorityScore[a.priority] !== priorityScore[b.priority]) {
                return priorityScore[b.priority] - priorityScore[a.priority];
            }
            return 0;
        });
    };

    const sortedEasy = sortTasks([...easyTasks]);
    const sortedMedium = sortTasks([...mediumTasks]);
    const sortedHard = sortTasks([...hardTasks]);

    // 3. Determine Targets based on Energy Level
    let targetEasy = 0;
    let targetMedium = 0;
    let targetHard = 0;

    if (energyLevel <= 2) {
        targetEasy = energyLevel;
    } else if (energyLevel === 3) {
        targetEasy = 1; targetMedium = 1; targetHard = 0;
    } else if (energyLevel === 4) {
        targetEasy = 2; targetMedium = 1; targetHard = 0;
    } else if (energyLevel === 5) {
        targetEasy = 1; targetMedium = 2; targetHard = 0;
    } else if (energyLevel === 6) {
        targetEasy = 0; targetMedium = 1; targetHard = 1;
    } else if (energyLevel === 7) {
        targetEasy = 0; targetMedium = 2; targetHard = 1;
    } else if (energyLevel >= 8 && energyLevel <= 9) {
        targetEasy = 0; targetMedium = 2; targetHard = 2;
    } else if (energyLevel === 10) {
        targetEasy = 0; targetMedium = 1; targetHard = 3;
    }

    console.log(`[EnergyAlgo] Targets - Easy: ${targetEasy}, Med: ${targetMedium}, Hard: ${targetHard}`);

    // 4. Selection & Fallback Logic
    const selected: Task[] = [];

    // Step A: Select Easy
    const selectedEasy = sortedEasy.slice(0, targetEasy);
    selected.push(...selectedEasy);

    // Fallback: If Easy shortage -> replace with 1 Medium
    const missingEasy = targetEasy - selectedEasy.length;
    if (missingEasy > 0) {
        console.log(`[EnergyAlgo] Missing ${missingEasy} Easy tasks. Converting to Medium.`);
        targetMedium += missingEasy;
    }

    // Step B: Select Medium
    const selectedMedium = sortedMedium.slice(0, targetMedium);
    selected.push(...selectedMedium);

    // Fallback: If Medium shortage -> replace with 1 Hard
    const missingMedium = targetMedium - selectedMedium.length;
    if (missingMedium > 0) {
        console.log(`[EnergyAlgo] Missing ${missingMedium} Medium tasks. Converting to Hard.`);
        targetHard += missingMedium;
    }

    // Step C: Select Hard
    const selectedHard = sortedHard.slice(0, targetHard);
    selected.push(...selectedHard);

    // Fallback: If Hard shortage -> replace with 2 Medium
    const missingHard = targetHard - selectedHard.length;
    if (missingHard > 0) {
        console.log(`[EnergyAlgo] Missing ${missingHard} Hard tasks. Converting to 2x Medium.`);
        const extraMediumNeeded = missingHard * 2;
        // Remaining mediums are those NOT in selectedMedium
        // Since selectedMedium was slice(0, N), the rest are slice(N)
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
