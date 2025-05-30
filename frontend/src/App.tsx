import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import ScrollToTop from '@/components/common/ScrollToTop';

import LandingPage from '@/pages/LandingPage';
import Homepage from '@/pages/Homepage';
import AuthPage from '@/pages/AuthPage';
import TopAnimePage from '@/pages/TopAnimePage';
import AnimeThreadPage from '@/pages/AnimeThreadPage';
import ThreadPage from '@/pages/ThreadPage';
import SearchResultPage from '@/pages/SearchResultPage';
import ProfilePage from '@/pages/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';

import { Toaster } from '@/components/ui/sonner';
import useAuthStore from '@/store/useAuthStore';

import { Navigate, Route, Routes } from 'react-router';
import { useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';

export default function App() {
    const { user, authCheck, isCheckingAuth } = useAuthStore();

    useEffect(() => {
        authCheck();
    }, [authCheck]);

    if (isCheckingAuth) {
        return (
            <div className='flex min-h-screen flex-grow items-center justify-center'>
                <LoaderCircle className='animate-spin text-muted-foreground' size={64} />
            </div>
        );
    }

    return (
        <div className='flex min-h-screen flex-col gap-2 transition-colors'>
            <Navbar />
            <main className='flex w-full flex-1 flex-col gap-1 px-4'>
                <Routes>
                    <Route path='/' element={user ? <Navigate to='/home' /> : <LandingPage />} />
                    <Route path='/home' element={user ? <Homepage /> : <Navigate to='/' />} />
                    <Route path='/auth' element={<AuthPage />} />
                    <Route path='/anime'>
                        <Route path='top' element={<TopAnimePage />} />
                        <Route path=':id' element={<AnimeThreadPage />} />
                        <Route path='search' element={<SearchResultPage />} />
                    </Route>
                    <Route path='/thread/:id' element={<ThreadPage />} />
                    <Route
                        path='/profile'
                        element={user ? <ProfilePage /> : <Navigate to='/auth/login' />}
                    />
                    <Route path='/*' element={<NotFoundPage />} />
                </Routes>
            </main>
            <ScrollToTop />
            <Toaster richColors />
            <Footer />
        </div>
    );
}
