import { Button } from '@/components/ui/button';
import usePinAnime from '@/hooks/usePinAnime';

import { PinOff, Pin } from 'lucide-react';

interface PinAnimeButtonProps {
    mal_id: number;
    title: string;
}

export function PinAnimeButton({ mal_id, title }: PinAnimeButtonProps) {
    const { isPinned, handlePin } = usePinAnime(mal_id, title);
    return (
        <Button size='icon' variant={isPinned ? 'destructive' : 'ghost'} onClick={handlePin}>
            {isPinned ? <PinOff /> : <Pin />}
        </Button>
    );
}
