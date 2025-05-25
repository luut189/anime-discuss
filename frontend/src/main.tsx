import '@/index.css';
import App from '@/App';
import { REFRESH_INTERVAL } from '@/common/constants';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchInterval: REFRESH_INTERVAL,
            retry: 5,
            staleTime: 1000 * 60 * 5,
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
);
