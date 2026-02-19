import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';

export default function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: fullName,
                    },
                },
            });

            if (error) throw error;

            // If email confirmation is enabled, user might not be logged in immediately depending on settings.
            // Assuming auto-confirm or just redirecting to login/home.
            // Usually need to show checks email.
            alert('Signup successful! Check your email for confirmation.');
            navigate('/auth/login');
        } catch (err: any) {
            setError(err.message || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <Card className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-center">Create Account</h2>
                <form onSubmit={handleSignup} className="space-y-4">
                    <Input
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        disabled={loading}
                    />
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
                        minLength={6}
                    />

                    {error && (
                        <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <Button className="w-full" type="submit" isLoading={loading}>
                        Sign Up
                    </Button>
                </form>
            </Card>
            <p className="text-center text-sm text-muted">
                Already have an account?{' '}
                <Link to="/auth/login" className="text-primary hover:underline">
                    Sign In
                </Link>
            </p>
        </div>
    );
}
