import BaseSection from '@/components/landing/BaseSection';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, CalendarDays, Smartphone, UserCheck, Bookmark } from 'lucide-react';

interface FeatureProps {
    icon: JSX.Element;
    title: string;
    description: string;
}

export default function FeatureSection() {
    const features: FeatureProps[] = [
        {
            icon: <MessageCircle />,
            title: 'Join Discussions',
            description: 'Engage with other anime fans and share your thoughts on each episode.',
        },
        {
            icon: <CalendarDays />,
            title: 'Daily Episode Updates',
            description: 'Stay on top of new releases with automatically updated episode lists.',
        },
        {
            icon: <Bookmark />,
            title: 'Pinned Anime',
            description: 'Pin your favorite shows and never miss out on new episodes.',
        },
        {
            icon: <Smartphone />,
            title: 'Mobile-Friendly',
            description: 'Enjoy a seamless experience on both mobile and desktop devices.',
        },
        {
            icon: <UserCheck />,
            title: 'Easy Sign-In',
            description: 'Create an account to comment, reply, and become part of the community.',
        },
    ];

    return (
        <BaseSection
            id='features'
            className='rounded-lg border'
            section='Features'
            title='Everything You Need'
            description='Our platform is designed by anime fans, for anime fans. Discover all the tools
                    you need to enhance your anime experience.'>
            {features.map((feat, idx) => (
                <Card key={idx} className='w-full md:w-1/3'>
                    <CardHeader>
                        <CardTitle>
                            <div className='mb-2 w-fit rounded-full bg-cyan-400/30 p-2 text-cyan-500 dark:bg-purple-900/45 dark:text-purple-400'>
                                {feat.icon}
                            </div>
                            {feat.title}
                        </CardTitle>
                        <CardDescription>{feat.description}</CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </BaseSection>
    );
}
