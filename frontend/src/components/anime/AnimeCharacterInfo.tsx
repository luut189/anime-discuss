import { fetchAnimeCharacters } from '@/api/anime';
import ErrorFallback from '@/components/common/ErrorFallback';

import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

interface AnimeCharacterInfoProps {
    id: string;
}

export default function AnimeCharacterInfo({ id }: AnimeCharacterInfoProps) {
    const [showAll, setShowAll] = useState(false);
    const { isError, isPending, data } = useQuery({
        queryKey: ['seiyuu', id],
        queryFn: () => fetchAnimeCharacters(id || '0'),
        enabled: !!id,
    });

    if (isError) {
        return <ErrorFallback errorMessage='Failed to fetch characters info...' />;
    }

    if (!data || isPending) {
        return (
            <div className='flex flex-grow items-center justify-center'>
                <LoaderCircle className='animate-spin text-muted-foreground' size={64} />
            </div>
        );
    }

    const dataToShow = showAll ? data.data : data.data.slice(0, 9);

    return (
        <div className='flex flex-col items-center justify-center gap-2'>
            {data.data.length > 9 ? (
                <Button variant={'link'} onClick={() => setShowAll(!showAll)} className='ml-auto'>
                    {showAll ? 'Hide' : 'Show all'}
                </Button>
            ) : null}
            <div className='grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {dataToShow.map((val) => {
                    const char = val.character;
                    const voiceJP = val.voice_actors.filter(
                        (voice) => voice.language === 'Japanese',
                    )[0];
                    if (!voiceJP) return null;

                    return (
                        <div className='flex justify-between gap-2 rounded-lg border'>
                            <img
                                className='w-1/6 rounded-lg'
                                src={char.images.jpg.image_url}
                                alt={char.name}
                            />
                            <a
                                href={`https://myanimelist.net/character/${char.mal_id}`}
                                target='_blank'
                                className='w-1/2 text-wrap p-1 text-start text-sm font-medium underline-offset-2 hover:underline'>
                                {char.name}
                            </a>
                            <a
                                href={`https://myanimelist.net/people/${voiceJP.person.mal_id}`}
                                target='_blank'
                                className='w-1/2 text-wrap p-1 text-end text-sm font-medium underline-offset-2 hover:underline'>
                                {voiceJP.person.name}
                            </a>
                            <img
                                className='w-1/6 rounded-lg'
                                src={voiceJP.person.images.jpg.image_url}
                                alt={voiceJP.person.name}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
