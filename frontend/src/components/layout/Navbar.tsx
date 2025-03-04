import SearchBar from '@/components/search/SearchBar';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
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

import { useNavigate } from 'react-router';
import { LogIn, LogOut, MessagesSquare, User } from 'lucide-react';
import { IUser } from '@/common/interfaces';

export default function Navbar() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    return (
        <nav className='flex p-4'>
            <div
                className='flex cursor-pointer items-center gap-2 text-xl font-bold'
                onClick={() => navigate('/')}>
                <MessagesSquare />
                AniDis
            </div>
            <div className='flex w-full items-center justify-end gap-4'>
                <SearchBar />
                <ThemeToggle />
                {user ? <UserAvatarButton {...user} /> : <LoginButton />}
            </div>
        </nav>
    );
}

function UserAvatarButton({ image, username }: IUser) {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={image} />
                    <AvatarFallback>{username}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='mt-2 flex flex-col gap-2 p-2'>
                <DropdownMenuLabel>{username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                    <LogOut />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function LoginButton() {
    const { authCheck } = useAuthStore();
    const navigate = useNavigate();
    return (
        <Button
            onClick={() => {
                authCheck();
                navigate('/auth/login');
            }}>
            <LogIn /> Login
        </Button>
    );
}
