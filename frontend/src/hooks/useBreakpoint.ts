import { useEffect, useState } from 'react';

type Breakpoint = '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'base';

function getBreakpoint(width: number): Breakpoint {
    if (width >= 1536) return '2xl';
    if (width >= 1280) return 'xl';
    if (width >= 1024) return 'lg';
    if (width >= 768) return 'md';
    if (width >= 640) return 'sm';
    return 'base';
}

const breakpointOrder: Record<Breakpoint, number> = {
    base: 0,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    '2xl': 5,
};

export function isBreakpointAtLeast(current: Breakpoint, minimum: Breakpoint): boolean {
    return breakpointOrder[current] >= breakpointOrder[minimum];
}

function useBreakpoint(): Breakpoint {
    const [breakpoint, setBreakpoint] = useState(getBreakpoint(window.innerWidth));

    useEffect(() => {
        const handleResize = () => {
            setBreakpoint(getBreakpoint(window.innerWidth));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return breakpoint;
}

export default useBreakpoint;
