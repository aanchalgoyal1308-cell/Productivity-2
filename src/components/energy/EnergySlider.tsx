import { useState } from 'react';
import { useEnergyStore } from '../../store/useEnergyStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Zap } from 'lucide-react';
import { cn } from '../../utils/cn';

export function EnergySlider() {
    const { todayLog, logEnergy, isLoading } = useEnergyStore();
    const [value, setValue] = useState(todayLog?.level || 5);
    const [submitted, setSubmitted] = useState(false);

    // If already logged today, show summary state
    if (todayLog) {
        return (
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-primary flex items-center gap-2">
                            <Zap className="w-5 h-5 fill-current" />
                            Energy Logged
                        </h3>
                        <p className="text-2xl font-bold mt-1 text-primary">{todayLog.level}/10</p>
                    </div>
                    <p className="text-sm text-muted italic">Great job checking in!</p>
                </CardContent>
            </Card>
        );
    }

    const handleLog = async () => {
        await logEnergy(value);
        setSubmitted(true);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    How are you feeling?
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center">
                    <span className={cn(
                        "text-4xl font-bold transition-colors",
                        value <= 3 ? "text-red-500" : value <= 7 ? "text-yellow-500" : "text-green-500"
                    )}>
                        {value}
                    </span>
                    <p className="text-sm text-muted mt-1">
                        {value <= 3 ? "Low Energy - Focus on small wins" :
                            value <= 7 ? "Balanced - Good for steady work" :
                                "High Energy - Tackle big projects!"}
                    </p>
                </div>

                <input
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value) as any)}
                    className="w-full h-2 bg-muted/30 rounded-lg appearance-none cursor-pointer accent-primary"
                />

                <Button
                    className="w-full"
                    onClick={handleLog}
                    isLoading={isLoading}
                    disabled={submitted}
                >
                    Log Energy
                </Button>
            </CardContent>
        </Card>
    );
}
