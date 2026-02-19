import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function AppLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-1 pb-20 container mx-auto px-4 py-4 max-w-md md:max-w-2xl lg:max-w-4xl">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
}
