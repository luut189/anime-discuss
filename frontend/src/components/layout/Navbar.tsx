import SearchBar from '@/components/search/SearchBar';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

import { useNavigate } from 'react-router';
import { MessagesSquare } from 'lucide-react';

export default function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className='flex p-4'>
            <div
                className='flex cursor-pointer items-center gap-2 text-xl font-bold'
                onClick={() => navigate('/')}>
                <MessagesSquare />
                AniDis
            </div>
            <div className='flex w-full flex-row justify-end gap-2'>
                <SearchBar />
                <ThemeToggle />
            </div>
        </nav>
    );
}
