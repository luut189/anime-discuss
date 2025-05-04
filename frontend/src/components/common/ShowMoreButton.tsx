import { Button } from '@/components/ui/button';

interface ShowMoreButtonProps {
    count: number;
    setCount: React.Dispatch<React.SetStateAction<number>>;
    length: number;
    range: number;
}

export default function ShowMoreButton({ count, setCount, length, range }: ShowMoreButtonProps) {
    return (
        <Button
            variant={'outline'}
            onClick={() => setCount(count < length ? count + range : range)}>
            Show {count < length ? 'More' : 'Less'} Threads
        </Button>
    );
}
