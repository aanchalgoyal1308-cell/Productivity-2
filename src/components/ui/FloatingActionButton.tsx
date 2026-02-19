import { Plus } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick: () => void;
}

export function FloatingActionButton({ onClick, className, ...props }: FloatingActionButtonProps) {
    return (
        <Button
            onClick={onClick}
            className={cn(
                "fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-lg z-50 p-0 flex items-center justify-center",
                className
            )}
            {...props}
        >
            <Plus className="w-8 h-8 text-white" />
        </Button>
    );
}
