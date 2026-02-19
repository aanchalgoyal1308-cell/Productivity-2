import { NavLink } from 'react-router-dom';
import { Home, ListTodo, BarChart2, User } from 'lucide-react';
import { cn } from '../../utils/cn';

export function BottomNav() {
    const navItems = [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Tasks', path: '/tasks', icon: ListTodo },
        { label: 'Stats', path: '/dashboard', icon: BarChart2 },
        { label: 'My Profile', path: '/profile', icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-muted/20 pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                                isActive ? "text-primary" : "text-muted hover:text-text"
                            )
                        }
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
