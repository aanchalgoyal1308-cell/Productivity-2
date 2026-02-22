import { create } from 'zustand';
import type { EnergyLog, EnergyLevel } from '../types';
import { supabase } from '../services/supabaseClient';

interface EnergyStoreState {
    energyLogs: EnergyLog[];
    todayLog: EnergyLog | null;
    isLoading: boolean;
    error: string | null;
    fetchTodayLog: () => Promise<void>;
    logEnergy: (level: EnergyLevel, notes?: string) => Promise<void>;
}

export const useEnergyStore = create<EnergyStoreState>((set) => ({
    energyLogs: [],
    todayLog: null,
    isLoading: false,
    error: null,

    fetchTodayLog: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('energy_logs')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(1);
            if (error) throw error;
            set({ todayLog: data && data.length > 0 ? data[0] : null });
        } catch (err: unknown) {
            set({ error: err instanceof Error ? err.message : String(err) });
        } finally {
            set({ isLoading: false });
        }
    },

    logEnergy: async (level: EnergyLevel, notes?: string) => {
        set({ isLoading: true, error: null });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id || 'guest-user-123';
            const log: EnergyLog = {
                id: crypto.randomUUID(),
                user_id: userId,
                date: new Date().toISOString().split('T')[0],
                level,
                notes,
                timestamp: new Date().toISOString(),
            };
            set(state => ({ energyLogs: [...state.energyLogs, log], todayLog: log }));
            if (userId !== 'guest-user-123') {
                const { error } = await supabase.from('energy_logs').insert([log]);
                if (error) set(state => ({ ...state, error: error.message }));
            }
        } catch (err: unknown) {
            set({ error: err instanceof Error ? err.message : String(err) });
        } finally {
            set({ isLoading: false });
        }
    },
}));