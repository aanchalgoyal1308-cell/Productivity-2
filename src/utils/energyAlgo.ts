import type { Task, EnergyLevel } from '../types';

export interface AssignmentMetrics {
    userEnergy: EnergyLevel;
    budget: number;
    maxTasks: number;
    assignedCount: number;
    totalCost: number;
}

export interface TaskAssignmentResult {
    assigned: Task[];
    metrics: AssignmentMetrics;
}

// STEP 1: Compute numeric budget
function computeBudget(userEnergy: EnergyLevel): number {
    const budget = Math.round(userEnergy * 3);
    return Math.max(budget, userEnergy);
}

// STEP 2: Compute soft task cap
function computeMaxTasks(userEnergy: EnergyLevel): number {
    return Math.min(userEnergy, 5);
}

// STEP 3: Priority weighting
function getPriorityWeight(priority: string): number {
    const weights: Record<string, number> = {
        high: 0.8,
        medium: 1.0,
        low: 1.2,
    };
    return weights[priority] || 1.0;
}

// STEP 4: Compute adjusted cost (with aging boost)
function computeAdjustedCost(task: Task): number {
    const priorityWeight = getPriorityWeight(task.priority);
    let adjustedCost = task.effort * priorityWeight;

    // Apply aging boost (anti-starvation)
    if (task.created_at) {
        const now = new Date();
        const createdDate = new Date(task.created_at);
        const daysSinceCreation = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

        // If task hasn't been assigned in >= 5 days, reduce cost by 10%
        if (daysSinceCreation >= 5) {
            adjustedCost = adjustedCost * 0.9;
        }
    }

    return adjustedCost;
}

// STEP 6: Sort tasks by priority, due date, effort
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

// STEP 7: Assign initial guarantees (psychological balance)
function assignInitialGuarantees(
    candidates: Task[],
    budget: number,
    maxTasks: number,
    userEnergy: EnergyLevel
): { assigned: Task[]; remainingBudget: number; remainingCandidates: Task[] } {
    const assigned: Task[] = [];
    let remainingBudget = budget;
    const usedIds = new Set<string>();

    // A) Assign highest priority task first
    const highPriorityTasks = candidates.filter(t => t.priority === 'high');
    if (highPriorityTasks.length > 0) {
        const task = highPriorityTasks[0];
        const cost = computeAdjustedCost(task);
        const costThreshold = userEnergy >= 4 ? budget : budget * 0.7;

        if (cost <= remainingBudget && cost <= costThreshold) {
            assigned.push(task);
            remainingBudget -= cost;
            usedIds.add(task.id);
        }
    }

    // B) Assign low-energy quick-win task (energyLevel <= 3)
    if (assigned.length < maxTasks) {
        const quickWinCandidates = candidates.filter(
            t => t.effort <= 3 && !usedIds.has(t.id) && t.priority !== 'high'
        );
        if (quickWinCandidates.length > 0) {
            const task = sortTasks(quickWinCandidates)[0];
            const cost = computeAdjustedCost(task);

            if (cost <= remainingBudget) {
                assigned.push(task);
                remainingBudget -= cost;
                usedIds.add(task.id);
            }
        }
    }

    const remainingCandidates = candidates.filter(t => !usedIds.has(t.id));

    return { assigned, remainingBudget, remainingCandidates };
}

// STEP 8 & 9: Main assignment loop with fallback
function assignMainLoop(
    candidates: Task[],
    initialAssigned: Task[],
    budget: number,
    maxTasks: number,
    userEnergy: EnergyLevel
): Task[] {
    let assigned = [...initialAssigned];
    let remainingBudget = budget - initialAssigned.reduce((sum, t) => sum + computeAdjustedCost(t), 0);
    const usedIds = new Set(assigned.map(t => t.id));

    const sorted = sortTasks(candidates);

    // Main loop: assign tasks while budget and task cap allow
    for (const task of sorted) {
        if (assigned.length >= maxTasks) break;
        if (usedIds.has(task.id)) continue;

        const cost = computeAdjustedCost(task);

        // Prevent large task domination
        if (cost > budget * 0.7 && userEnergy < 4) {
            continue;
        }

        // Check budget and cap constraints
        if (cost <= remainingBudget && assigned.length < maxTasks) {
            assigned.push(task);
            remainingBudget -= cost;
            usedIds.add(task.id);
        }
    }

    // STEP 9: Fallback rule (ensure at least one meaningful task)
    if (assigned.length === 0) {
        const fallbackCandidates = candidates
            .filter(t => t.priority === 'high' && t.effort <= userEnergy + 1)
            .sort((a, b) => a.effort - b.effort);

        if (fallbackCandidates.length > 0) {
            assigned.push(fallbackCandidates[0]);
        }
    }

    return assigned;
}

// MAIN EXPORT: assignTasks function
export function assignTasks(userEnergy: EnergyLevel, tasks: Task[]): TaskAssignmentResult {
    // STEP 5: Pre-filter (exclude completed and daily tasks)
    const candidates = tasks.filter(
        t => !t.is_completed && t.recurrence_type !== 'daily'
    );

    console.log(`[assignTasks] Candidates: ${candidates.length}`);

    // Compute numeric constraints
    const budget = computeBudget(userEnergy);
    const maxTasks = computeMaxTasks(userEnergy);

    // STEP 6: Sort candidates
    const sortedCandidates = sortTasks(candidates);

    // STEP 7: Assign initial guarantees
    const { assigned: initialAssigned, remainingCandidates } = assignInitialGuarantees(
        sortedCandidates,
        budget,
        maxTasks,
        userEnergy
    );

    // STEP 8 & 9: Main loop with fallback
    const finalAssigned = assignMainLoop(
        remainingCandidates,
        initialAssigned,
        budget,
        maxTasks,
        userEnergy
    );

    // Calculate metrics
    const totalCost = finalAssigned.reduce((sum, t) => sum + computeAdjustedCost(t), 0);

    const metrics: AssignmentMetrics = {
        userEnergy,
        budget,
        maxTasks,
        assignedCount: finalAssigned.length,
        totalCost: Math.round(totalCost * 100) / 100,
    };

    console.log(`[assignTasks] Energy ${userEnergy}: Budget ${budget}, MaxTasks ${maxTasks}, Assigned ${finalAssigned.length}, TotalCost ${metrics.totalCost}`);

    return {
        assigned: finalAssigned,
        metrics,
    };
}

export interface TaskSelectionResult {
    tasks: Task[];
    daily: Task[];
    suggested: Task[];
}

export function filterTasksByEnergy(tasks: Task[], energyLevel: EnergyLevel): TaskSelectionResult {
    // Get all active tasks
    const allActive = tasks.filter(t => !t.is_completed);

    // Separate daily tasks (always show, limited to 3)
    const daily = allActive.filter(t => t.recurrence_type === 'daily');
    const sortedDaily = sortTasks(daily).slice(0, 3);

    // Use new assignment logic for suggested tasks
    const result = assignTasks(energyLevel, tasks);
    const suggested = result.assigned;

    return {
        tasks: allActive,
        daily: sortedDaily,
        suggested,
    };
}

// Legacy function for distribution info
export function getTaskDistribution(energy: EnergyLevel): { budget: number; maxTasks: number } {
    return {
        budget: computeBudget(energy),
        maxTasks: computeMaxTasks(energy),
    };
}