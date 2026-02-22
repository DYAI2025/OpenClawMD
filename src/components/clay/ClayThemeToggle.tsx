import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

export function ClayThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-10 h-10 rounded-full bg-clay-sand shadow-clay border border-white/40 dark:border-white/[0.06] flex items-center justify-center hover:shadow-clay-lifted hover:-translate-y-0.5 active:shadow-clay-inset active:translate-y-0.5 transition-all duration-250 ease-clay"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-clay-coral" />
      ) : (
        <Moon className="w-4 h-4 text-clay-charcoal" />
      )}
    </button>
  );
}
