import BaseSection from '@/components/landing/BaseSection';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Quote } from 'lucide-react';

interface UserCommentProps {
    comment: string;
    username: string;
    userDescription: string;
}

export default function CommunitySection() {
    const userComments: UserCommentProps[] = [
        {
            username: 'OtakuTony',
            userDescription: 'Certified Binge-Watcher',
            comment: 'Finally, a site where I can argue about filler episodes without judgment.',
        },
        {
            username: 'WaifuInspector',
            userDescription: 'Head of Anime Affairs',
            comment: 'I came for the episode tracker, stayed for the chaos in the comment section.',
        },
        {
            username: 'SleepDeprivedSenpai',
            userDescription: 'Online at 3AM, always',
            comment:
                'AniDis is the only reason I still know what day it is... Anyway, new episode time!',
        },
        {
            username: 'ZoroInTheComments',
            userDescription: 'Still lost, but vibing',
            comment: 'Tried to find the logout button. Found a new anime instead. 10/10.',
        },
        {
            username: 'AnimeDad',
            userDescription: 'Raises kids on shonen values',
            comment: 'This site taught me more about anime than my own kids ever did.',
        },
        {
            username: 'IsekaiEnjoyer',
            userDescription: 'On my 7th reincarnation',
            comment: 'Every day I wake up hoping AniDis adds isekai-only filters. Still waiting.',
        },
    ];

    return (
        <BaseSection
            id='community'
            section='Community'
            title='Join the Community of Anime Fans'
            description='Our community is growing every day with passionate discussions about all things
                    anime.'>
            {userComments.map((cmt, idx) => (
                <Card key={idx} className='w-full md:w-1/3'>
                    <CardHeader>
                        <CardTitle>
                            <div className='mb-2 w-fit rounded-full p-2 text-cyan-500 dark:text-purple-400'>
                                <Quote />
                            </div>
                            <p className='text-2xl'>{cmt.comment}</p>
                        </CardTitle>
                        <CardDescription>
                            {cmt.username} - {cmt.userDescription}
                        </CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </BaseSection>
    );
}
