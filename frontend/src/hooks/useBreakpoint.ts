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
