import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],

                    router: ['react-router'],

                    forms: ['react-hook-form', '@hookform/resolvers', 'zod'],

                    'radix-ui': [
                        '@radix-ui/react-avatar',
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-hover-card',
                        '@radix-ui/react-label',
                        '@radix-ui/react-separator',
                        '@radix-ui/react-slot',
                        '@radix-ui/react-tabs',
                        '@radix-ui/react-tooltip',
                    ],

                    styling: [
                        'class-variance-authority',
                        'clsx',
                        'tailwind-merge',
                        'tailwindcss-animate',
                    ],

                    data: ['@tanstack/react-query', 'zustand'],

                    content: ['react-markdown', 'browser-image-compression'],

                    'ui-utils': ['lucide-react', 'next-themes', 'sonner'],
                },
            },
        },
    },
});
