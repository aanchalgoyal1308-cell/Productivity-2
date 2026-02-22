import { create } from 'zustand';
import type { Task } from '../types';
import { supabase } from '../services/supabaseClient';

interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;

    fetchTasks: () => Promise<void>;
    addTask: (task: Omit<Task, 'id' | 'user_id' | 'timestamp' | 'is_completed'>) => Promise<void>;
    updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    toggleTaskCompletion: (id: string, isCompleted: boolean) => Promise<void>;
    seedDefaults: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,

    fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) throw error;
            set({ tasks: data as Task[] });
        } catch (err: unknown) {
            set({ error: err instanceof Error ? err.message : String(err) });
        } finally {
            set({ isLoading: false });
        }
    },

    addTask: async (newTask) => {
        let userId: string | undefined;
        try {
            const response = await supabase.auth.getUser();
            userId = response.data?.user?.id;
        } catch {
            userId = undefined;
        }

        if (!userId) {
            const isGuest = localStorage.getItem('isGuest') === 'true';
            if (isGuest) userId = 'guest-user-123';
            else return;
        }

        const tempId = crypto.randomUUID();
        const optimisticTask: Task = {
            ...newTask,
            id: tempId,
            user_id: userId,
            timestamp: new Date().toISOString(),
            is_completed: false,
        } as Task;

        set((state) => ({ tasks: [optimisticTask, ...state.tasks] }));

        if (userId === 'guest-user-123') return;

        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{ ...newTask, user_id: userId, timestamp: new Date().toISOString() }])
                .select()
                .single();

            if (error) throw error;

            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === tempId ? (data as Task) : t)),
            }));
        } catch (err: unknown) {
            set({ error: err instanceof Error ? err.message : String(err) });
            set((state) => ({ tasks: state.tasks.filter((t) => t.id !== tempId) }));
        }
    },

    updateTask: async (id, updates) => {
        set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));

        try {
            const { error } = await supabase.from('tasks').update(updates).eq('id', id);
            if (error) throw error;
            await get().fetchTasks();
        } catch (err: unknown) {
            set({ error: err instanceof Error ? err.message : String(err) });
            get().fetchTasks();
        }
    },

    deleteTask: async (id) => {
        const previousTasks = get().tasks;
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));

        try {
            const { error } = await supabase.from('tasks').delete().eq('id', id);
            if (error) throw error;
        } catch (err: unknown) {
            set({ error: err instanceof Error ? err.message : String(err), tasks: previousTasks });
        }
    },

    toggleTaskCompletion: async (id, isCompleted) => {
        const updates: Partial<Task> = {
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
        };
        await get().updateTask(id, updates);
    },

    seedDefaults: async () => {
        let userId: string | undefined;
        try {
            const response = await supabase.auth.getUser();
            userId = response.data?.user?.id;
        } catch {
            userId = undefined;
        }

        const isGuest = !userId;
        const finalUserId = userId || 'guest-user-123';

        const { getDefaultTasks } = await import('../data/defaultTasks');
        const defaultTasks = getDefaultTasks(finalUserId);

        set({ isLoading: true });

        if (isGuest) {
            const newTasks = defaultTasks.map((t) => ({
                ...t,
                id: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
                created_at: new Date().toISOString(),
                is_completed: false,
                recurrence_value: undefined,
                tags: [],
            } as Task));
            set((state) => ({ tasks: [...newTasks, ...state.tasks], isLoading: false }));
        } else {
            try {
                const { error } = await supabase.from('tasks').insert(defaultTasks).select();
                if (error) throw error;
                await get().fetchTasks();
            } catch (err: unknown) {
                console.error('Failed to seed:', err);
                set({ error: err instanceof Error ? err.message : String(err), isLoading: false });
            }
        }
    },
}));