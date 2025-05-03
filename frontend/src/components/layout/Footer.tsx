export default function Footer() {
    return (
        <footer className='flex items-center justify-center p-4 text-xs text-muted-foreground'>
            &copy; {new Date().getFullYear()} and built with ❤️ by{' '}
            <a
                href='http://github.com/luut189'
                target='_blank'
                rel='noopener noreferrer'
                className='ml-1 underline underline-offset-2 hover:text-primary'>
                Tuong Luu
            </a>
            . All Rights Reserved.
        </footer>
    );
}
