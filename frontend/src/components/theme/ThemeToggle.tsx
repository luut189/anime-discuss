import { useTheme } from '@/components/theme/ThemeProvider';
import { Button } from '@/components/ui/button';

import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    let isDark = theme == 'dark';

    return (
        <Button
            title={'Switch to ' + (isDark ? 'light' : 'dark') + ' mode'}
            size={'icon'}
            onClick={() => {
                isDark = !isDark;
                setTheme(isDark ? 'dark' : 'light');
            }}>
            <div className='flex'>
                <Sun className='rotate-0 scale-0 transition-all dark:rotate-90 dark:scale-100' />
                <Moon className='absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
            </div>
        </Button>
    );
}
