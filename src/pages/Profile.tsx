import { useAuthStore } from '../store/useAuthStore';
import { User, Settings, Palette, Sliders, LogOut, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function Profile() {
    const { user, signOut } = useAuthStore();
    const isGuest = !user?.email;

    const menuItems = [
        { icon: Sliders, label: 'Manage Rules', action: () => alert('Rules management coming soon') },
        { icon: Palette, label: 'Theme', action: () => alert('Theme customization coming soon') },
        { icon: Settings, label: 'Customisations', action: () => alert('Customisations coming soon') },
    ];

    const handleLogout = async () => {
        if (confirm('Are you sure you want to log out?')) {
            await signOut();
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-primary">My Profile</h1>
                <p className="text-muted text-sm">Manage your account and preferences.</p>
            </div>

            {/* User Info Card */}
            <Card className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-text">
                        {isGuest ? 'Guest User' : user?.email?.split('@')[0] || 'User'}
                    </h2>
                    <p className="text-sm text-muted">
                        {isGuest ? 'Not signed in' : user?.email}
                    </p>
                </div>
            </Card>

            {/* Menu List */}
            <div className="space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={item.action}
                        className="w-full flex items-center justify-between p-4 bg-surface rounded-xl border border-muted/20 hover:border-primary/30 transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-muted/5 text-muted">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-text">{item.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted/50" />
                    </button>
                ))}
            </div>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-4 mt-6 text-red-500 font-medium hover:bg-red-50 rounded-xl transition-colors"
            >
                <LogOut className="w-5 h-5" />
                Logout
            </button>

            <div className="text-center text-xs text-muted/50 pt-4">
                ClarityFlow v1.0.0
            </div>
        </div>
    );
}
