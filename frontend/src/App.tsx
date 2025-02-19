import { Route, Routes } from 'react-router';
import Homepage from '@/pages/Homepage';
import TrendingAnimePage from '@/pages/TrendingAnimePage';
import AnimeThreadPage from '@/pages/AnimeThreadPage';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';

export default function App() {
    return (
        <div className='flex min-h-screen flex-col'>
            <Navbar />
            <main className='mx-auto flex w-full flex-1 flex-col gap-1 px-4'>
                <Routes>
                    <Route path='/' element={<Homepage />} />
                    <Route path='/anime/trending' element={<TrendingAnimePage />} />
                    <Route path='/anime/:id' element={<AnimeThreadPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}
