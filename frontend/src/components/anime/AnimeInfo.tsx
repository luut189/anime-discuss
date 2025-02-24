import { JikanAnimeData } from '@/common/interfaces';
import { formatDate } from '@/lib/utils';
import { Heart, Star, Users } from 'lucide-react';

interface AnimeInfoProps {
    data: JikanAnimeData;
}

export default function AnimeInfo({ data }: AnimeInfoProps) {
    return (
        <div className='rounded-lg bg-muted/50 p-6'>
            <div className='flex flex-col gap-6 md:flex-row'>
                <div className='flex-shrink-0'>
                    <img
                        src={data.images.jpg.image_url}
                        alt={data.title_english}
                        className='rounded-lg'
                    />
                </div>
                <div className='flex-grow'>
                    <h2 className='mb-2 text-2xl font-bold'>{data.title}</h2>
                    <p className='mb-4 text-sm text-muted-foreground'>{data.title_japanese}</p>
                    <div className='mb-4 grid grid-cols-2 gap-4'>
                        <div>
                            <p className='text-sm font-semibold'>
                                Type: <span className='font-normal'>{data.type}</span>
                            </p>
                            <p className='text-sm font-semibold'>
                                Episodes: <span className='font-normal'>{data.episodes}</span>
                            </p>
                            <p className='text-sm font-semibold'>
                                Status: <span className='font-normal'>{data.status}</span>
                            </p>
                            <p className='text-sm font-semibold'>
                                Aired:{' '}
                                <span className='font-normal'>
                                    {data.aired.from
                                        ? `From ${formatDate(data.aired.from)}`
                                        : 'Unknown'}
                                    {data.aired.to && ` to ${formatDate(data.aired.to)}`}
                                </span>
                            </p>
                        </div>
                        <div>
                            <p className='flex items-center text-sm font-semibold'>
                                <Star className='mr-1 h-4 w-4 text-yellow-400' />
                                Score:{' '}
                                <span className='ml-1 font-normal'>
                                    {data.score} ({data.scored_by} votes)
                                </span>
                            </p>
                            <p className='flex items-center text-sm font-semibold'>
                                <Users className='mr-1 h-4 w-4' />
                                Members:{' '}
                                <span className='ml-1 font-normal'>
                                    {data.members.toLocaleString()}
                                </span>
                            </p>
                            <p className='flex items-center text-sm font-semibold'>
                                <Heart className='mr-1 h-4 w-4 text-red-400' />
                                Favorites:{' '}
                                <span className='ml-1 font-normal'>
                                    {data.favorites.toLocaleString()}
                                </span>
                            </p>
                        </div>
                    </div>
                    <p className='mb-4 text-sm'>{data.synopsis}</p>
                    <div className='flex flex-wrap gap-2'>
                        {data.genres.map((genre) => (
                            <span
                                key={genre.mal_id}
                                className='rounded-full bg-primary/10 px-2 py-1 text-xs text-primary'>
                                {genre.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
