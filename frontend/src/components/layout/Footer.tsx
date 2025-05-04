export default function Footer() {
    return (
        <footer className='flex justify-between gap-1 p-4 text-xs text-muted-foreground'>
            <div className='text-left'>
                <p>&copy; {new Date().getFullYear()} AniDis. All rights reserved.</p>
                <p>
                    Built with ❤️ by{' '}
                    <a
                        href='http://github.com/luut189'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='ml-1 underline underline-offset-2 hover:text-primary'>
                        Tuong Luu
                    </a>
                </p>
            </div>
            <div className='text-right'>
                <p>
                    Powered by{' '}
                    <a
                        href='https://myanimelist.net/'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='underline'>
                        MyAnimeList
                    </a>
                </p>
                <p>
                    Powered by{' '}
                    <a
                        href='https://jikan.moe/'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='underline'>
                        Jikan API
                    </a>
                </p>
            </div>
        </footer>
    );
}
