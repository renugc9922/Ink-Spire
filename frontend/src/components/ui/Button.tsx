import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        const variants = {
            primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl border-0 hover:scale-[1.02] active:scale-[0.98]',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent shadow-md hover:shadow-lg',
            outline: 'bg-background/50 backdrop-blur-sm border-2 border-primary/20 text-foreground hover:bg-primary/5 hover:border-primary/40 hover:shadow-lg',
            ghost: 'bg-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground hover:backdrop-blur-sm',
            danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl',
            gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]',
        };

        const sizes = {
            sm: 'h-8 px-3 text-xs rounded-lg',
            md: 'h-10 px-4 text-sm rounded-xl',
            lg: 'h-12 px-6 text-base rounded-xl',
            xl: 'h-14 px-8 text-lg rounded-2xl',
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    'relative inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && (
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';