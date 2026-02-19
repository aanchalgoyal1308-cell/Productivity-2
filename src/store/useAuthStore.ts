import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    initialize: () => Promise<void>;
    signOut: () => Promise<void>;
    loginAsGuest: () => Promise<void>;
}

const GUEST_USER: User = {
    id: 'guest-user-123',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'guest@example.com',
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    confirmation_sent_at: '',
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { display_name: 'Guest User' },
    identities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
} as User;

const GUEST_SESSION: Session = {
    access_token: 'fake-token',
    token_type: 'bearer',
    expires_in: 3600,
    refresh_token: 'fake-refresh',
    user: GUEST_USER,
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isLoading: true,

    initialize: async () => {
        try {
            // Check for guest flag
            const isGuest = localStorage.getItem('isGuest') === 'true';
            if (isGuest) {
                set({ user: GUEST_USER, session: GUEST_SESSION, isLoading: false });
                return;
            }

            // Get initial session
            const { data: { session } } = await supabase.auth.getSession();
            set({ session, user: session?.user ?? null, isLoading: false });

            // Listen for changes
            supabase.auth.onAuthStateChange((_event, session) => {
                if (!localStorage.getItem('isGuest')) {
                    set({ session, user: session?.user ?? null, isLoading: false });
                }
            });
        } catch (error) {
            console.error('Auth initialization error:', error);
            set({ isLoading: false });
        }
    },

    signOut: async () => {
        if (localStorage.getItem('isGuest')) {
            localStorage.removeItem('isGuest');
            set({ session: null, user: null });
        } else {
            await supabase.auth.signOut();
            set({ session: null, user: null });
        }
    },

    loginAsGuest: async () => {
        localStorage.setItem('isGuest', 'true');
        set({ user: GUEST_USER, session: GUEST_SESSION });
    },
}));
