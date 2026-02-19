import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { useTaskStore } from '../../store/useTaskStore';

export const EmptyLibrary = () => {
    const { seedDefaults } = useTaskStore();

    return (
        <Card className="mb-6 border-dashed border-primary/20 bg-primary/5">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-white rounded-full shadow-sm">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-primary">Your library is empty</h3>
                    <p className="text-sm text-muted">Get started quickly by loading some sample tasks.</p>
                </div>
                <button
                    onClick={() => seedDefaults()}
                    className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    Load Demo Data
                </button>
            </CardContent>
        </Card>
    );
};
