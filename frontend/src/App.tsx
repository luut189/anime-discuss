import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Homepage from '@/pages/Homepage';
import { LoginPage, SignupPage } from '@/pages/AuthPage';
import TrendingAnimePage from '@/pages/TrendingAnimePage';
import AnimeThreadPage from '@/pages/AnimeThreadPage';
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
        <div className='flex min-h-screen flex-col transition-colors'>
            <Navbar />
            <main className='flex w-full flex-1 flex-col gap-1 px-4'>
                <Routes>
                    <Route path='/' element={<Homepage />} />
                    <Route path='/auth'>
                        <Route path='login' element={user ? <Navigate to='/' /> : <LoginPage />} />
                        <Route
                            path='signup'
                            element={user ? <Navigate to='/' /> : <SignupPage />}
                        />
                    </Route>
                    <Route path='/anime'>
                        <Route path='trending' element={<TrendingAnimePage />} />
                        <Route path=':id' element={<AnimeThreadPage />} />
                        <Route path='search' element={<SearchResultPage />} />
                    </Route>
                    <Route path='/profile' element={user ? <ProfilePage /> : <Navigate to='/' />} />
                    <Route path='/*' element={<NotFoundPage />} />
                </Routes>
            </main>
            <Footer />
            <Toaster />
        </div>
    );
}
