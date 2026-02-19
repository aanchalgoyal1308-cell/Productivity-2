import { useState, useEffect, useCallback } from 'react';
import type { Task, EnergyLevel } from '../types';
import { filterTasksByEnergy } from '../utils/energyAlgo';

export type DailyPlanProp = {
    date: string;
    energyLevel: number;
    dailyIds: string[];
    suggestedIds: string[]; // Explicitly store suggested tasks
};

export function useDailyPlan(tasks: Task[], todayLog: { level: EnergyLevel } | null) {
    const [dailyPlan, setDailyPlan] = useState<DailyPlanProp | null>(null);
    const [shuffleUsed, setShuffleUsed] = useState(false);

    // 1. Load from LocalStorage
    useEffect(() => {
        try {
            const storedPlan = localStorage.getItem('daily_plan');
            const storedShuffle = localStorage.getItem('daily_shuffle_used');
            const todayStr = new Date().toDateString();

            if (storedPlan) {
                const parsed = JSON.parse(storedPlan);
                // Validate schema matches current expectation
                if (parsed.date === todayStr && Array.isArray(parsed.dailyIds) && Array.isArray(parsed.suggestedIds)) {
                    setDailyPlan(parsed);
                    if (storedShuffle === todayStr) {
                        setShuffleUsed(true);
                    }
                } else {
                    // Invalid or old date
                    localStorage.removeItem('daily_plan');
                    localStorage.removeItem('daily_shuffle_used');
                }
            }
        } catch (e) {
            console.error("Failed to parse daily plan", e);
            localStorage.removeItem('daily_plan');
        }
    }, []);

    // 2. Generate Plan Logic
    useEffect(() => {
        if (!todayLog || tasks.length === 0) return;

        const todayStr = new Date().toDateString();
        let shouldGenerate = false;

        if (!dailyPlan) {
            shouldGenerate = true;
        } else if (dailyPlan.date !== todayStr) {
            shouldGenerate = true;
        } else if (dailyPlan.energyLevel !== todayLog.level) {
            shouldGenerate = true;
        } else {
            // Check staleness (if IDs in plan no longer exist in tasks)
            const allPlanIds = [...dailyPlan.dailyIds, ...dailyPlan.suggestedIds];
            const activeIds = tasks.map(t => t.id);
            const validIds = allPlanIds.filter(id => activeIds.includes(id));

            // If we lost a significant number of tasks (e.g. data wipe), regenerate
            if (activeIds.length > 0 && validIds.length === 0) {
                shouldGenerate = true;
            }
        }

        if (shouldGenerate) {
            console.log("[useDailyPlan] Generating new plan for level:", todayLog.level);
            const { daily, suggested } = filterTasksByEnergy(tasks, todayLog.level);

            // Limit suggested to top 5
            const topSuggested = suggested.slice(0, 5);

            const newPlan: DailyPlanProp = {
                date: todayStr,
                energyLevel: todayLog.level,
                dailyIds: daily.map(t => t.id),
                suggestedIds: topSuggested.map(t => t.id)
            };

            setDailyPlan(newPlan);
            setShuffleUsed(false);
            localStorage.setItem('daily_plan', JSON.stringify(newPlan));
            localStorage.removeItem('daily_shuffle_used');
        }
    }, [todayLog, tasks, dailyPlan]);

    // 3. Shuffle Action
    const handleShuffle = useCallback(() => {
        if (!todayLog || shuffleUsed) return;

        // Re-run filter to get candidates
        const { suggested } = filterTasksByEnergy(tasks, todayLog.level);

        // Take top 10 candidates
        const candidates = suggested.slice(0, 10);

        // Fisher-Yates Shuffle
        for (let i = candidates.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
        }

        // Pick new top 5
        const newSelection = candidates.slice(0, 5);

        const newPlan: DailyPlanProp = {
            date: new Date().toDateString(),
            energyLevel: todayLog.level,
            dailyIds: dailyPlan?.dailyIds || [], // keep daily tasks same
            suggestedIds: newSelection.map(t => t.id)
        };

        setDailyPlan(newPlan);
        setShuffleUsed(true);
        localStorage.setItem('daily_plan', JSON.stringify(newPlan));
        localStorage.setItem('daily_shuffle_used', new Date().toDateString());
    }, [todayLog, tasks, shuffleUsed, dailyPlan]);

    return { dailyPlan, shuffleUsed, handleShuffle };
}
