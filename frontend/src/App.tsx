import { Route, Routes } from 'react-router';
import Homepage from '@/pages/Homepage';
import TodayAnimePage from '@/pages/TodayAnimePage';

export default function App() {
    return (
        <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/anime/today' element={<TodayAnimePage />} />
        </Routes>
    );
}
