import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Homepage from '@/pages/Homepage';
import TrendingAnimePage from '@/pages/TrendingAnimePage';
import AnimeThreadPage from '@/pages/AnimeThreadPage';
import NotFoundPage from '@/pages/NotFoundPage';

import { Route, Routes } from 'react-router';

export default function App() {
    return (
        <div className='flex min-h-screen flex-col transition-colors'>
            <Navbar />
            <main className='mx-auto flex w-full flex-1 flex-col gap-1 px-4'>
                <Routes>
                    <Route path='/' element={<Homepage />} />
                    <Route path='/anime/trending' element={<TrendingAnimePage />} />
                    <Route path='/anime/:id' element={<AnimeThreadPage />} />
                    <Route path='/*' element={<NotFoundPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}
