import { Route, Routes } from 'react-router';
import Homepage from '@/pages/Homepage';
import TrendingAnimePage from '@/pages/TrendingAnimePage';

export default function App() {
    return (
        <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/anime/trending' element={<TrendingAnimePage />} />
        </Routes>
    );
}
