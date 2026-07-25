import { useTheme } from './theme-provider';
import { Button } from './Button';

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-background/50 backdrop-blur-sm shadow-sm">
            <Button
                variant={theme === 'light' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 px-3 text-xs font-medium transition-all"
                onClick={() => setTheme("light")}
                title="Bright Mode"
            >
                Bright
            </Button>
            <Button
                variant={theme === 'dark' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 px-3 text-xs font-medium transition-all"
                onClick={() => setTheme("dark")}
                title="Dark Mode"
            >
                Dark
            </Button>
        </div>
    );
}
