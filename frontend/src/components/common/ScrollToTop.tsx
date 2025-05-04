import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ScrollToTop() {
    const [isVisible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setVisible(window.scrollY > 200);
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    function handleScroll() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return isVisible ? (
        <Button
            className='fixed bottom-12 right-12 rounded-full'
            size={'icon'}
            onClick={handleScroll}>
            <ChevronUp />
        </Button>
    ) : null;
}
