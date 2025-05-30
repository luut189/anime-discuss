import SearchBar from '@/components/search/SearchBar';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button, IconButton } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAuthStore from '@/store/useAuthStore';

import { LogIn, LogOut, Menu, MessagesSquare, User } from 'lucide-react';
import { IUser } from '@/common/interfaces';
import { useEffect, useState } from 'react';
import useBreakpoint, { isBreakpointAtLeast } from '@/hooks/useBreakpoint';

export default function Navbar() {
    const { user } = useAuthStore();
    return (
        <nav className='flex p-4'>
            <a className='flex cursor-pointer items-center gap-2 text-xl font-bold' href='/'>
                <MessagesSquare />
                AniDis
            </a>
            <div className='flex w-full items-center justify-end gap-2 sm:gap-4'>
                {user ? <SearchBar /> : <NavigationLinks />}
                <ThemeToggle />
                {user ? <UserAvatarButton {...user} /> : <LoginButton />}
            </div>
        </nav>
    );
}

interface NavigationLink {
    displayName: string;
    href: string;
}

function NavigationLinks() {
    const links: NavigationLink[] = [
        { displayName: 'Anime List', href: '/anime/top' },
        { displayName: 'Features', href: '/#features' },
        { displayName: 'Community', href: '/#community' },
    ];

    const [onMobile, setOnMobile] = useState(false);
    const breakpoint = useBreakpoint();

    useEffect(() => {
        setOnMobile(!isBreakpointAtLeast(breakpoint, 'lg'));
    }, [breakpoint]);

    const dropdownNav = (
        <DropdownMenu>
            <DropdownMenuTrigger className='mx-2 flex items-center justify-center transition-transform data-[state=open]:rotate-90'>
                <Menu />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {links.map((link, idx) => (
                    <DropdownMenuItem key={idx} asChild>
                        <a href={link.href}>{link.displayName}</a>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <div>
            {onMobile
                ? dropdownNav
                : links.map((link, idx) => (
                      <Button key={idx} variant={'link'} asChild>
                          <a href={link.href}>{link.displayName}</a>
                      </Button>
                  ))}
        </div>
    );
}

function UserAvatarButton({ image, username }: IUser) {
    const { logout } = useAuthStore();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage className='object-cover' src={image} />
                    <AvatarFallback>{username}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='mt-2 flex flex-col gap-2 p-2'>
                <DropdownMenuLabel>{username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <a href='/profile'>
                    <DropdownMenuItem className='cursor-pointer'>
                        <User />
                        Profile
                    </DropdownMenuItem>
                </a>
                <DropdownMenuItem onClick={logout} className='cursor-pointer'>
                    <LogOut />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function LoginButton() {
    return (
        <a href='/auth?tab=login'>
            <IconButton icon={<LogIn />}>Login</IconButton>
        </a>
    );
}
