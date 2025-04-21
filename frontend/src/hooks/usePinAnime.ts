import { pinAnime, unpinAnime } from '@/api/user';
import useAuthStore from '@/store/useAuthStore';

import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

function usePinAnime(mal_id: number, title: string) {
    const { user, setUser } = useAuthStore();
    const queryClient = useQueryClient();
    const [isPinned, setIsPinned] = useState(false);

    useEffect(() => {
        if (user?.pinnedAnime) {
            setIsPinned(user.pinnedAnime.includes(`${mal_id}`));
        }
    }, [user, mal_id]);

    async function handlePin() {
        if (!user) return;

        try {
            const newPinnedAnime = isPinned
                ? user.pinnedAnime.filter((id) => id !== `${mal_id}`)
                : [...user.pinnedAnime, `${mal_id}`];

            setUser({ ...user, pinnedAnime: newPinnedAnime });

            setIsPinned(!isPinned);

            toast.success(`${isPinned ? 'Unpinned' : 'Pinned'} ${title}`);

            await (isPinned ? unpinAnime(mal_id) : pinAnime(mal_id));

            queryClient.invalidateQueries({ queryKey: ['pinned-anime', user._id] });
        } catch (error) {
            console.error(error);
            toast.error(`Failed to ${isPinned ? 'unpin' : 'pin'} ${title}`);
        }
    }

    return { isPinned, handlePin };
}

export default usePinAnime;
