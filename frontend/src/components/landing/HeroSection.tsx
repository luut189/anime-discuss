import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/useAuthStore';

export default function HeroSection() {
    const { authCheck } = useAuthStore();

    return (
        <section className='flex min-h-[calc(100vh-4.5rem)]'>
            <div className='flex w-full flex-col items-center justify-center gap-4 xl:flex-row'>
                <div className='flex flex-col items-start justify-center gap-2'>
                    <h1 className='bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text py-2 text-6xl font-semibold tracking-tighter text-transparent dark:from-purple-400 dark:to-pink-400'>
                        Join the ultimate anime community
                    </h1>
                    <p className='w-3/4 text-xl text-muted-foreground'>
                        Discuss your favorite anime, share theories, find recommendations, and
                        connect with fellow fans from around the world.
                    </p>
                    <Button className='mt-4' onClick={authCheck} asChild>
                        <a href='/auth/login'>Get Started</a>
                    </Button>
                </div>
                <div className='rounded-lg border'>
                    <img
                        className='rounded-lg object-cover'
                        src='/app_preview.png'
                        alt='App Preview'
                    />
                </div>
            </div>
        </section>
    );
}
