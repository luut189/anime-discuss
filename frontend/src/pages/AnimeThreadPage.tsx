import { fetchAnimeById } from '@/api/anime';
import ErrorFallback from '@/components/common/ErrorFallback';
import AnimeInfo from '@/components/anime/AnimeInfo';
import Threads from '@/components/thread/Threads';
import CreateThread from '@/components/thread/CreateThread';

import { LoaderCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useState } from 'react';
import AnimeCharacterInfo from '@/components/anime/AnimeCharacterInfor';

export default function AnimeThreadPage() {
    const [showVoice, setShowVoice] = useState(false);
    const { id } = useParams();

    const { isError, isPending, data } = useQuery({
        queryKey: ['data', id],
        queryFn: () => fetchAnimeById(id || '0'),
        enabled: !!id,
        retry: 5,
    });

    if (isError) {
        return <ErrorFallback errorMessage={`Cannot find data with the ID ${id}!`} />;
    }

    if (!data || isPending) {
        return (
            <div className='flex flex-grow items-center justify-center'>
                <LoaderCircle className='animate-spin text-muted-foreground' size={64} />
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-4'>
            <AnimeInfo {...data} showVoice={showVoice} setShowVoice={setShowVoice} />
            {showVoice ? <AnimeCharacterInfo id={id || '0'} /> : null}
            <CreateThread id={id as string} />
            <Threads id={id as string} />
        </div>
    );
}
