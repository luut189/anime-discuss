import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

interface BaseSectionProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    section: string;
    title: string;
    description: string;
}

export default function BaseSection({
    className,
    section,
    title,
    description,
    children,
    ...props
}: BaseSectionProps) {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const el = document.querySelector(location.hash);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth' });
                }, 0);
            }
        }
    }, [location]);

    return (
        <section
            {...props}
            className={cn('flex min-h-[calc(100vh-4.5rem)] scroll-mt-10 p-4', className)}>
            <div className='flex w-full flex-col items-center justify-center gap-4'>
                <div className='flex items-center justify-center rounded-lg bg-cyan-400/30 p-1 text-center text-sm text-cyan-500 dark:bg-purple-900/45 dark:text-purple-400'>
                    {section}
                </div>
                <h1 className='text-center text-6xl font-bold tracking-tighter'>{title}</h1>
                <p className='w-2/3 text-center text-xl text-muted-foreground'>{description}</p>
                <div className='flex w-full flex-wrap items-center justify-center gap-2 px-2'>
                    {children}
                </div>
            </div>
        </section>
    );
}
