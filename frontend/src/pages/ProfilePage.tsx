import { getPinnedAnime, getUserProfile, getUserThreads } from '@/api/user';
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
import ErrorFallback from '@/components/common/ErrorFallback';
import useAuthStore from '@/store/useAuthStore';
import { WEEKDAYS } from '@/common/constants';
import useSubmit from '@/hooks/useSubmit';

import { Loader, Pencil, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';

const TO_ADD = 3;

export default function ProfilePage() {
    const { id } = useParams();

    const { user } = useAuthStore();

    const { data, isPending } = useQuery({
        queryKey: ['profile', id],
        queryFn: () => getUserProfile(id as string),
        enabled: !!id,
    });

    if (isPending) {
        return <div></div>;
    }

    if (!data) {
        return <ErrorFallback errorMessage={`No user found with ID ${id}`} />;
    }

    return (
        <div className='flex flex-col items-center justify-center gap-4'>
            <Card className='w-full sm:w-2/3'>
                <CardHeader>
                    <div className='flex flex-col items-center justify-center gap-2'>
                        <div className='group relative h-32 w-32'>
                            <Avatar className='h-full w-full'>
                                <AvatarImage
                                    className='object-cover'
                                    src={data.image}
                                    alt={data.username}
                                />
                                <AvatarFallback>
                                    {data.username.substring(0, 1).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            {id === user?._id ? (
                                <div className='absolute inset-0 flex items-center justify-center rounded-full bg-primary-foreground/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                                    <EditProfilePicture />
                                </div>
                            ) : null}
                        </div>
                        <CardTitle className='text-2xl'>
                            {id === user?._id ? `Hello ${user?.username}!` : data.username}
                        </CardTitle>
                    </div>
                </CardHeader>
            </Card>
            {user ? (
                <>
                    <Section title='Threads'>
                        <ThreadsContainer username={data?.username} id={id as string} />
                    </Section>
                    <Section title='Today Anime'>
                        <AnimeContainer type='today' username={data?.username} id={id as string} />
                    </Section>
                    <Section title='Pinned Anime'>
                        <AnimeContainer type='pinned' username={data?.username} id={id as string} />
                    </Section>
                </>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Please login to view other's profile</CardTitle>
                    </CardHeader>
                </Card>
            )}
        </div>
    );
}

interface SectionProps {
    children: React.ReactNode;
    title: string;
}

function Section({ children, title }: SectionProps) {
    return (
        <section className='flex w-full flex-col gap-4'>
            <h2 className='text-2xl font-bold'>{title}</h2>
            {children}
        </section>
    );
}

function EditProfilePicture() {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { user, setUser } = useAuthStore();

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    useEffect(() => {
        if (!isOpen) {
            setImage(null);
            setPreview(null);
        }
    }, [isOpen]);

    const { isSubmitting: isChanging, onSubmit: handleImageChange } = useSubmit(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            };
            try {
                const compressedFile = await imageCompression(file, options);
                setImage(compressedFile);
                setPreview(URL.createObjectURL(compressedFile));
            } catch (error) {
                console.log(error);
            }
        },
    );

    const { isSubmitting: isUploading, onSubmit: handleUpload } = useSubmit(async () => {
        if (!image) return;
        if (!user) return;

        const formData = new FormData();
        formData.append('file', image);

        const response = await fetch('/api/user/avatar', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log('Uploaded successfully!');
            const data = (await response.json()).url as string;
            setUser({ ...user, image: data });
            setIsOpen(false);
            toast.success('Avatar uploaded successfully!');
        } else {
            console.error('Upload failed');
        }
    });

    const { isSubmitting: isRemoving, onSubmit: removeAvatar } = useSubmit(async () => {
        if (!window.confirm('Are you sure to remove this avatar?')) return;
        if (!user) return;

        const response = await fetch('/api/user/avatar', {
            method: 'DELETE',
        });
        if (response.ok) {
            console.log('Deleted successfully!');
            const data = (await response.json()).url as string;
            setUser({ ...user, image: data });
            setIsOpen(false);
            toast.success('Avatar deleted successfully!');
        } else {
            console.error('Delete failed');
        }
    });

    const isLoading = isUploading || isChanging;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={'ghost'} size={'icon'} className='rounded-full'>
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:w-2/3'>
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
                <Input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    disabled={isLoading}
                />
                <DialogFooter className='gap-1'>
                    <Button
                        disabled={isLoading || isRemoving}
                        variant={'destructive'}
                        onClick={removeAvatar}>
                        {isRemoving ? (
                            <Loader className='animate-spin' />
                        ) : (
                            <>
                                <X />
                                Remove avatar
                            </>
                        )}
                    </Button>
                    <Button
                        disabled={!image || isLoading}
                        onClick={handleUpload}
                        size={isLoading ? 'icon' : 'default'}>
                        {isLoading ? <Loader className='animate-spin' /> : 'Upload image'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface ProfileContainerProps {
    username: string;
    id: string;
}

function ThreadsContainer({ username, id }: ProfileContainerProps) {
    const [count, setCount] = useState(TO_ADD);
    const { user } = useAuthStore();
    const { data, isPending } = useQuery({
        queryKey: ['threads', id],
        queryFn: () => getUserThreads(id),
        enabled: !!id,
    });

    if (isPending) {
        return <ThreadSkeleton />;
    }

    if (!data || data.length === 0) {
        return (
            <div className='flex items-center justify-center rounded-lg border p-4'>
                {id === user?._id ? 'You' : username} haven't created any thread yet.
                {id === user?._id ? ' Want to start something?' : null}
            </div>
        );
    }

    return (
        <>
            {data.slice(0, count).map((thread) => (
                <Thread key={thread._id} {...thread} />
            ))}
            {count < data.length ? (
                <ShowMoreButton
                    count={count}
                    setCount={setCount}
                    length={data.length}
                    range={TO_ADD}
                />
            ) : null}
        </>
    );
}

interface AnimeContainerProps extends ProfileContainerProps {
    type: 'today' | 'pinned';
}

function AnimeContainer({ id, username, type }: AnimeContainerProps) {
    const { user } = useAuthStore();

    const { data: pinnedAnime, isPending } = useQuery({
        queryKey: ['pinned-anime', id],
        queryFn: () => getPinnedAnime(id),
        enabled: !!id,
    });

    const todayAnime = useMemo(
        () =>
            pinnedAnime?.filter(
                (anime) =>
                    anime.broadcast.day?.slice(0, -1) === WEEKDAYS[new Date().getDay()] &&
                    anime.airing,
            ),
        [pinnedAnime],
    );

    const animeList = type === 'today' ? todayAnime : pinnedAnime;

    if (!isPending && (!animeList || animeList.length === 0)) {
        return (
            <div className='flex items-center justify-center rounded-lg border p-4'>
                {type === 'today'
                    ? `There is nothing broadcast today that ${id === user?._id ? 'you' : username} like :(`
                    : 'There is nothing here but loneliness...'}
            </div>
        );
    }

    return <AnimeCardGrid isPendingData={isPending} items={animeList || Array(5).fill(null)} />;
}
