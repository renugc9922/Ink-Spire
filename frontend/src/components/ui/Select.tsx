import React from 'react';
import { cn } from '../../lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={cn(
                            'flex h-11 w-full appearance-none rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 px-3 py-2 text-sm text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/60 hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] disabled:opacity-50',
                            className
                        )}
                        {...props}>
                        {options.map((opt) => (
                            <option
                                key={opt.value}
                                value={opt.value}
                                className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                            >
                                {opt.label}
                            </option>
                        ))}

                    </select>
                    {/* Custom chevron */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);
Select.displayName = 'Select';