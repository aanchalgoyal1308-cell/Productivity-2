import * as React from 'react';
import { cn } from '../../utils/cn';

// Note: I will need to install class-variance-authority if I haven't already.
// Checking deps... I did not install class-variance-authority.
// I should install it or just use simple props.
// User spec didn't mention CVA, but it's standard. I'll stick to simple props to avoid extra deps if not needed, or install it.
// Actually, simple clsx logic is fine for now.

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        const variants = {
            primary: 'bg-primary text-white hover:bg-opacity-90 active:scale-95 shadow-sm',
            secondary: 'bg-secondary text-white hover:bg-opacity-90 active:scale-95 shadow-sm',
            outline: 'border-2 border-primary text-primary hover:bg-primary/10 active:scale-95',
            ghost: 'hover:bg-muted/10 text-text active:scale-95',
            danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95 shadow-sm',
        };

        const sizes = {
            sm: 'h-8 px-3 text-sm',
            md: 'h-10 px-4 py-2',
            lg: 'h-12 px-6 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
