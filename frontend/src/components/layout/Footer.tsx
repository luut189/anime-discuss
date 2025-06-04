export default function Footer() {
    return (
        <footer className='flex items-end justify-between gap-1 p-4 text-xs text-muted-foreground'>
            <div className='text-left'>
                <img src='/mascot.png' alt='Mascot' className='h-20 w-20' />
                <p>&copy; {new Date().getFullYear()} AniDis. All rights reserved.</p>
                <p>
                    Built with ❤️ by{' '}
                    <a
                        href='http://github.com/luut189'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='font-semibold underline hover:text-primary'>
                        Tuong Luu
                    </a>
                </p>
            </div>
            <div className='text-right'>
                <p>
                    Drawings by <span className='font-semibold'>Chirika</span>
                </p>
                <p>
                    Powered by{' '}
                    <a
                        href='https://myanimelist.net/'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='font-semibold underline hover:text-primary'>
                        MyAnimeList
                    </a>
                </p>
                <p>
                    Powered by{' '}
                    <a
                        href='https://jikan.moe/'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='font-semibold underline hover:text-primary'>
                        Jikan API
                    </a>
                </p>
            </div>
        </footer>
    );
}
