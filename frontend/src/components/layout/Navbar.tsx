import { useNavigate } from 'react-router';
import SearchBar from '@/components/SearchBar';

export default function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className='flex p-4'>
            <div
                className='mr-auto flex cursor-pointer items-center gap-2 text-xl font-bold'
                onClick={() => navigate('/')}>
                AniDis
            </div>
            <SearchBar />
        </nav>
    );
}
