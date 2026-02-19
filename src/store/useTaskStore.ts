import { create } from 'zustand';
import type { Task } from '../types';
import { supabase } from '../services/supabaseClient';

interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;

    fetchTasks: () => Promise<void>;
    addTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'is_completed'>) => Promise<void>;
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
                .order('created_at', { ascending: false });

            if (error) throw error;
            set({ tasks: data as Task[] });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addTask: async (newTask) => {
        const { data: { user } } = await supabase.auth.getUser();

        let userId = user?.id;
        if (!userId) {
            const isGuest = localStorage.getItem('isGuest') === 'true';
            if (isGuest) {
                userId = 'guest-user-123';
            } else {
                return; // Not logged in and not guest
            }
        }

        // Optimistic update
        const tempId = crypto.randomUUID();
        const optimisticTask: Task = {
            ...newTask,
            id: tempId,
            user_id: userId,
            created_at: new Date().toISOString(),
            is_completed: false,
            // ensure optional fields are present if needed by type, though Omit handles most
        } as Task;

        set((state) => ({ tasks: [optimisticTask, ...state.tasks] }));

        if (userId === 'guest-user-123') {
            // Guest mode: just keep the optimistic task (update ID if we want, but tempId is fine)
            // We just return, state is already updated. 
            // Maybe we want to simulate a network delay? Nah.
            return;
        }

        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{ ...newTask, user_id: userId }])
                .select()
                .single();

            if (error) throw error;

            // Replace optimistic task with real one
            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === tempId ? (data as Task) : t)),
            }));
        } catch (err: any) {
            set({ error: err.message });
            // Revert optimistic update
            set((state) => ({ tasks: state.tasks.filter((t) => t.id !== tempId) }));
        }
    },

    updateTask: async (id, updates) => {
        // Optimistic
        set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));

        try {
            const { error } = await supabase
                .from('tasks')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            await get().fetchTasks(); // Refresh to ensure consistency
        } catch (err: any) {
            set({ error: err.message });
            // Revert (needs previous state, complex here, skipping revert for MVP simplicity or fetch)
            get().fetchTasks();
        }
    },

    deleteTask: async (id) => {
        const previousTasks = get().tasks;
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));

        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (err: any) {
            set({ error: err.message, tasks: previousTasks });
        }
    },

    toggleTaskCompletion: async (id, isCompleted) => {
        const updates: Partial<Task> = {
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null, // null is allowed now in type
        };
        await get().updateTask(id, updates);
    },

    seedDefaults: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        // Check for guest
        const isGuest = !user;
        const userId = user?.id || 'guest-user-123';

        // Imported from data file to keep store clean
        const { getDefaultTasks } = await import('../data/defaultTasks');
        const defaultTasks = getDefaultTasks(userId);

        set({ isLoading: true });

        // Batch insert
        // Supabase allows bulk insert
        if (isGuest) {
            const newTasks = defaultTasks.map(t => ({
                ...t,
                id: crypto.randomUUID(),
                created_at: new Date().toISOString(),
                is_completed: false,
                recurrence_value: undefined,
                tags: []
            } as Task));
            set(state => ({ tasks: [...newTasks, ...state.tasks], isLoading: false }));
        } else {
            try {
                const { error } = await supabase
                    .from('tasks')
                    .insert(defaultTasks)
                    .select();

                if (error) throw error;
                // Determine if we append or refetch. Refetch is safer.
                await get().fetchTasks();
            } catch (err: any) {
                console.error("Failed to seed:", err);
                set({ error: err.message, isLoading: false });
            }
        }
    }
}));
