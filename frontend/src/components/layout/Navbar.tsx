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
import { useAuth } from '@/store/useAuth';

import { useNavigate } from 'react-router';
import { LogIn, LogOut, MessagesSquare, User } from 'lucide-react';

export default function Navbar() {
    const navigate = useNavigate();
    const { user, authCheck, logout } = useAuth();
    return (
        <nav className='flex p-4'>
            <div
                className='flex cursor-pointer items-center gap-2 text-xl font-bold'
                onClick={() => navigate('/')}>
                <MessagesSquare />
                AniDis
            </div>
            <div className='flex w-full flex-row items-center justify-end gap-2'>
                <SearchBar />
                <ThemeToggle />
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src={user.image} />
                                <AvatarFallback>{user.username}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={logout}>
                                <LogOut />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button
                        onClick={() => {
                            authCheck();
                            navigate('/auth/login');
                        }}>
                        <LogIn /> Login
                    </Button>
                )}
            </div>
        </nav>
    );
}
