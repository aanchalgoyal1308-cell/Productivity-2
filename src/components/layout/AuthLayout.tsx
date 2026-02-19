import { Outlet } from 'react-router-dom';

export function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tighter text-primary">
                        ClarityFlow
                    </h1>
                    <p className="text-muted text-sm">
                        Focus on what matters, when you have the energy.
                    </p>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
