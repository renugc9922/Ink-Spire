import React from 'react';
import { cn } from '../../lib/utils';

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Slider: React.FC<SliderProps> = ({ label, className, ...props }) => {
    return (
        <div className="w-full">
            <div className="flex justify-between mb-2">
                {label && (
                    <label className="text-sm font-medium text-slate-400">
                        {label}
                    </label>
                )}
                <span className="text-sm font-medium text-slate-500">
                    {props.value}%
                </span>
            </div>
            <input
                type="range"
                className={cn(
                    "w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                    className
                )}
                {...props}
            />
        </div>
    );
};
