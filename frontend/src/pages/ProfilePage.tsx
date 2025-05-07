import { getPinnedAnime, getUserThreads } from '@/api/user';
import ShowMoreButton from '@/components/common/ShowMoreButton';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AnimeCardGrid from '@/components/anime/AnimeCardGrid';
import { Thread, ThreadSkeleton } from '@/components/thread/Thread';
import useAuthStore from '@/store/useAuthStore';
import { WEEKDAYS } from '@/common/constants';

import { Loader, Pencil, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router';
import { useState } from 'react';
import imageCompression from 'browser-image-compression';

const TO_ADD = 3;

export default function ProfilePage() {
    const { user } = useAuthStore();
    if (!user) return <Navigate to='/auth/login' />;
    return (
        <div className='flex flex-col items-center justify-center gap-4'>
            <Card className='w-2/3'>
                <CardHeader>
                    <div className='flex flex-col items-center justify-center gap-2'>
                        <div className='group relative h-32 w-32'>
                            <Avatar className='h-full w-full'>
                                <AvatarImage
                                    className='object-cover'
                                    src={user.image}
                                    alt={user.username}
                                />
                                <AvatarFallback>
                                    {user.username.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                                <EditProfilePicture />
                            </div>
                        </div>
                        <CardTitle className='text-2xl'>Hello {user.username}!</CardTitle>
                    </div>
                </CardHeader>
            </Card>
            <div className='flex w-full flex-col gap-4'>
                <h2 className='text-2xl font-bold'>Threads</h2>
                <ThreadsContainer />
            </div>
            <div className='flex w-full flex-col gap-4'>
                <h2 className='text-2xl font-bold'>Today Anime</h2>
                <AnimeContainer type='today' />
            </div>
            <div className='flex w-full flex-col gap-4'>
                <h2 className='text-2xl font-bold'>Pinned Anime</h2>
                <AnimeContainer type='pinned' />
            </div>
        </div>
    );
}

function EditProfilePicture() {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { user, setUser } = useAuthStore();

    async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };
        try {
            setIsUploading(true);
            const compressedFile = await imageCompression(file, options);
            setImage(compressedFile);
            setPreview(URL.createObjectURL(compressedFile));
            setIsUploading(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleUpload() {
        if (!image) return;
        if (!user) return;

        const formData = new FormData();
        formData.append('file', image);

        setIsUploading(true);
        const response = await fetch('/api/user/avatar', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log('Uploaded successfully!');
        } else {
            console.error('Upload failed');
        }
        const data = (await response.json()).url as string;
        setUser({ ...user, image: data });
        setIsUploading(false);
        setIsOpen(false);
    }

    async function removeAvatar() {
        if (!user) return;

        setIsUploading(true);
        const response = await fetch('/api/user/avatar', {
            method: 'DELETE',
        });
        if (response.ok) {
            console.log('Deleteed successfully!');
        } else {
            console.error('Delete failed');
        }
        setIsUploading(false);
        const data = (await response.json()).url as string;
        setUser({ ...user, image: data });
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={'ghost'}
                    size={'icon'}
                    className='rounded-full'
                    onClick={() => console.log('Edit avatar clicked')}>
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Edit Avatar</DialogTitle>
                    <DialogDescription>
                        Make changes to your avatar here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                {preview ? (
                    <div className='flex items-center justify-center'>
                        <Avatar className='h-32 w-32'>
                            <AvatarImage className='object-cover' src={preview} />
                            <AvatarFallback></AvatarFallback>
                        </Avatar>
                    </div>
                ) : (
                    <div className='flex h-32 w-full items-center justify-center rounded-md border text-sm font-semibold'>
                        Preview Image
                    </div>
                )}
                <Input type='file' accept='image/*' onChange={handleImageChange} />
                <DialogFooter>
                    <Button disabled={isUploading} variant={'destructive'} onClick={removeAvatar}>
                        <X /> Remove avatar
                    </Button>
                    <Button
                        disabled={!image || isUploading}
                        onClick={handleUpload}
                        size={isUploading ? 'icon' : 'default'}>
                        {isUploading ? <Loader className='animate-spin' /> : 'Upload image'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ThreadsContainer() {
    const [count, setCount] = useState(TO_ADD);
    const { user } = useAuthStore();
    const { data, isPending } = useQuery({
        queryKey: ['threads', user?._id],
        queryFn: getUserThreads,
        enabled: !!user,
        retry: 5,
        staleTime: 1000 * 60 * 5,
    });

    if (isPending) {
        return <ThreadSkeleton />;
    }

    if (!data || data.length === 0) {
        return (
            <div className='flex items-center justify-center rounded-lg border p-4'>
                You haven't created any thread yet. Want to start something?
            </div>
        );
    }

    return (
        <>
            {data.slice(0, count).map((thread) => (
                <Thread key={thread._id} {...thread} />
            ))}
            <ShowMoreButton count={count} setCount={setCount} length={data.length} range={TO_ADD} />
        </>
    );
}

interface AnimeContainerProps {
    type: 'today' | 'pinned';
}

function AnimeContainer({ type }: AnimeContainerProps) {
    const { user } = useAuthStore();
    const { data: pinnedAnime, isPending } = useQuery({
        queryKey: ['pinned-anime', user?._id],
        queryFn: getPinnedAnime,
        enabled: !!user,
        retry: 5,
        staleTime: 1000 * 60 * 5,
    });

    const todayAnime = pinnedAnime?.filter(
        (anime) =>
            anime.broadcast.day?.slice(0, -1) === WEEKDAYS[new Date().getDay()] && anime.airing,
    );

    const animeList = type === 'today' ? todayAnime : pinnedAnime;

    if (!isPending && (!animeList || animeList.length === 0)) {
        return (
            <div className='flex items-center justify-center rounded-lg border p-4'>
                {type === 'today'
                    ? 'There is nothing broadcast today that you like :('
                    : 'There is nothing here but loneliness...'}
            </div>
        );
    }

    return <AnimeCardGrid isPendingData={isPending} items={animeList || Array(5).fill(null)} />;
}
