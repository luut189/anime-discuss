import { MulterRequest } from '@/common/interfaces';
import { AuthRequest } from '@/middleware/protect.route';
import { Anime } from '@/models/anime.model';
import Thread from '@/models/thread.model';
import User from '@/models/user.model';
import { uploadToCloudinary } from '@/service/cloudinary';
import { getAnimeById } from '@/service/jikan';

import { Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

async function getUserThreads(req: AuthRequest, res: Response) {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const threads = await Thread.find({ authorId: user.id }).sort({ path: 1, createdAt: -1 });
        res.status(200).json(threads);
    } catch (error) {
        console.error('Error fetching threads:', error);
        res.status(500).json({ error: 'Failed to fetch threads' });
    }
}

async function getPinnedAnime(req: AuthRequest, res: Response) {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const userData = await User.findById(user.id).select('pinnedAnime');
        if (!userData) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        const animeIds = userData.pinnedAnime.map((item) => item.animeId);
        if (animeIds.length === 0) {
            res.status(201).json([]);
            return;
        }

        const data = await Anime.find({ mal_id: { $in: animeIds.map((id) => Number(id)) } });

        const sortedData = animeIds
            .map((id) => {
                const animeData = data.find((anime) => anime.mal_id === Number(id));
                const pinnedEntry = userData.pinnedAnime.find((item) => item.animeId === id);

                if (animeData && pinnedEntry) {
                    return {
                        ...animeData.toObject(),
                        watchedEpisodes: pinnedEntry.watchedEpisodes || [],
                    };
                }
                return null;
            })
            .filter(Boolean);

        res.status(200).json(sortedData);
    } catch (error) {
        console.error('Error fetching pinned anime:', error);
        res.status(500).json({ error: 'Failed to fetch pinned anime' });
    }
}

async function addPinnedAnime(req: AuthRequest, res: Response) {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { mal_id } = req.body;
        if (!mal_id) {
            res.status(400).json({ error: 'Anime ID is required' });
            return;
        }

        const userData = await User.findById(user.id);
        if (!userData) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (!userData.pinnedAnime.some((item) => item.animeId === mal_id)) {
            userData.pinnedAnime.push({
                animeId: mal_id,
                watchedEpisodes: [],
            });

            await userData.save();
        }

        const anime = await getAnimeById(mal_id);

        await Anime.findOneAndUpdate({ mal_id }, anime, { upsert: true });

        res.status(200).json(userData.pinnedAnime);
    } catch (error) {
        console.error('Error adding pinned anime:', error);
        res.status(500).json({ error: 'Failed to pin anime' });
    }
}

async function removePinnedAnime(req: AuthRequest, res: Response) {
    try {
        const user = req.user;
        const { mal_id } = req.body;

        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!mal_id) {
            res.status(400).json({ error: 'Anime ID is required' });
            return;
        }

        const updatedUser = await User.findByIdAndUpdate(
            user.id,
            { $pull: { pinnedAnime: { animeId: mal_id } } },
            { new: true, select: 'pinnedAnime' },
        );

        if (!updatedUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json(updatedUser.pinnedAnime);
    } catch (error) {
        console.error('Error removing pinned anime:', error);
        res.status(500).json({ error: 'Failed to unpin anime' });
    }
}

async function updateWatchedEpisode(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?._id;
        const { animeId } = req.params;
        const { episode, watched } = req.body;

        if (!animeId || typeof episode !== 'number' || typeof watched !== 'boolean') {
            res.status(400).json({ message: 'Invalid request data.' });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const animeEntry = user.pinnedAnime.find((item) => item.animeId === animeId);

        if (!animeEntry) {
            res.status(404).json({ message: 'User did not pin this anime' });
            return;
        }

        if (watched && !animeEntry.watchedEpisodes.includes(episode)) {
            for (let i = 1; i <= episode; i++) {
                if (!animeEntry.watchedEpisodes.includes(i)) {
                    animeEntry.watchedEpisodes.push(i);
                }
            }
        } else if (!watched && animeEntry.watchedEpisodes.includes(episode)) {
            animeEntry.watchedEpisodes = animeEntry.watchedEpisodes.filter((ep) => ep !== episode);
        }

        await user.save();

        res.status(200).json({
            message: 'Watch status updated successfully',
            pinnedAnime: user.pinnedAnime.filter((item) => item.animeId === animeId),
        });
    } catch (error) {
        console.error('Error updating watched episode:', error);
        res.status(500).json({ error: 'Error updating watched episode' });
    }
}

async function updateAvatar(req: MulterRequest & AuthRequest, res: Response) {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const userId = req.user;

        const { url } = await uploadToCloudinary(req.file.buffer, 'avatars');

        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (!user.image) {
            res.status(400).json({ message: 'No avatar found for this user' });
            return;
        }

        const avatarPublicId = user.image.split('/').pop()?.split('.')[0];

        if (avatarPublicId) await cloudinary.uploader.destroy(`avatars/${avatarPublicId}`);

        await User.findByIdAndUpdate(userId, { image: url });

        res.status(200).json({ url });
    } catch (error) {
        console.error('Cloudinary upload failed:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
}

async function removeAvatar(req: MulterRequest & AuthRequest, res: Response) {
    try {
        const userId = req.user?._id;

        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (!user.image) {
            res.status(400).json({ message: 'No avatar found for this user' });
            return;
        }

        const avatarPublicId = user.image.split('/').pop()?.split('.')[0];

        if (avatarPublicId) await cloudinary.uploader.destroy(`avatars/${avatarPublicId}`);

        const PROFILE_PICS = ['/avatar1.png', '/avatar2.png', '/avatar3.png'];
        user.image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        await user.save();

        res.status(200).json({ url: user.image });
    } catch (error) {
        console.log('Failed to remove avatar:', error);
        res.status(500).json({ error: 'Failed to remove avatar' });
    }
}

export {
    getUserThreads,
    getPinnedAnime,
    addPinnedAnime,
    removePinnedAnime,
    updateWatchedEpisode,
    updateAvatar,
    removeAvatar,
};
