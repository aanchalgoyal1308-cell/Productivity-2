import { create } from 'zustand';
import type { EnergyLog } from '../types';
import { supabase } from '../services/supabaseClient';
import dayjs from 'dayjs';

interface EnergyState {
    todayLog: EnergyLog | null;
    history: EnergyLog[];
    isLoading: boolean;
    error: string | null;

    fetchTodayLog: () => Promise<void>;
    logEnergy: (level: number, notes?: string) => Promise<void>;
}

export const useEnergyStore = create<EnergyState>((set) => ({
    todayLog: null,
    history: [],
    isLoading: false,
    error: null,

    fetchTodayLog: async () => {
        set({ isLoading: true });
        try {
            const today = dayjs().format('YYYY-MM-DD');
            const { data, error } = await supabase
                .from('energy_logs')
                .select('*')
                .eq('date', today)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows found"

            set({ todayLog: data ? (data as EnergyLog) : null });
        } catch (err: any) {
            // ignore 406 or no rows
            if (err.code !== 'PGRST116') {
                console.error(err);
            }
        } finally {
            set({ isLoading: false });
        }
    },

    logEnergy: async (level, notes) => {
        // Get user from AuthStore to support Guest Mode
        // We need to dynamically import or rely on checking supabase user first, then falling back
        const { data: { user } } = await supabase.auth.getUser();

        const today = dayjs().format('YYYY-MM-DD');

        if (!user) {
            // Guest Mode Logic
            // In a real app we might want to verify if 'isGuest' is true in localStorage
            const isGuest = localStorage.getItem('isGuest') === 'true';
            if (isGuest) {
                const guestLog: EnergyLog = {
                    id: crypto.randomUUID(),
                    user_id: 'guest-user-123',
                    date: today,
                    level: level as unknown as any, // Temporary cast or fix type definition
                    notes,
                    created_at: new Date().toISOString()
                };
                set({ todayLog: guestLog });
                return;
            }
            return;
        }

        const newLog = {
            user_id: user.id,
            date: today,
            level,
            notes,
        };

        try {
            const { data, error } = await supabase
                .from('energy_logs')
                .upsert(newLog, { onConflict: 'user_id,date' })
                .select()
                .single();

            if (error) throw error;
            set({ todayLog: data as EnergyLog });
        } catch (err: any) {
            set({ error: err.message });
        }
    },
}));
