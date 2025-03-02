import { IUser } from '@/common/interfaces';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

function usePinAnime(user: IUser | null, mal_id: number, title: string) {
    const [isPinned, setIsPinned] = useState(false);

    useEffect(() => {
        if (user?.pinnedAnime) {
            setIsPinned(user.pinnedAnime.includes(`${mal_id}`));
        }
    }, [user, mal_id]);

    async function handlePin() {
        if (!user) return;

        try {
            const method = isPinned ? 'DELETE' : 'POST';
            const response = await fetch('/api/user/pinnedAnime', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mal_id }),
            });

            if (response.ok) {
                toast.success(`${isPinned ? 'Unpinned' : 'Pinned'} ${title}`);
                setIsPinned(!isPinned);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return { isPinned, handlePin };
}

export default usePinAnime;
