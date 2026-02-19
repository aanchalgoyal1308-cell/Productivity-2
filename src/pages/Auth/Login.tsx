import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const from = location.state?.from?.pathname || '/';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Auth state update is handled by useAuthStore subscription
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <Card className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-center">Welcome Back</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />

                    {error && (
                        <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            type="button"
                            onClick={async () => {
                                const { loginAsGuest } = await import('../../store/useAuthStore').then(m => ({ loginAsGuest: m.useAuthStore.getState().loginAsGuest }));
                                await loginAsGuest();
                                navigate('/');
                            }}
                        >
                            Continue as Guest (No Login Required)
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-surface px-2 text-muted-foreground">Or sign in with email</span>
                            </div>
                        </div>
                        <Button className="w-full" type="submit" isLoading={loading}>
                            Sign In
                        </Button>
                    </div>
                </form>
            </Card>
            <p className="text-center text-sm text-muted">
                Don't have an account?{' '}
                <Link to="/auth/signup" className="text-primary hover:underline">
                    Sign Up
                </Link>
            </p>
        </div>
    );
}
