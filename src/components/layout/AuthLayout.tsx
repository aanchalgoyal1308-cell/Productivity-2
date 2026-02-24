import { Outlet } from 'react-router-dom';

export function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <h1 className="text-5xl font-bold tracking-tighter text-primary">
                        MOOD
                    </h1>
                    <p className="text-muted text-sm">
                        Moments Of Organized Doing
                    </p>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
