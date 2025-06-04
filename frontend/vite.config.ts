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
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react')) return 'vendor-react';
                        if (id.includes('@tanstack/react-query')) return 'vendor-react-query';
                        if (id.includes('@radix-ui')) return 'vendor-radix';
                        if (id.includes('zod')) return 'vendor-zod';
                        if (id.includes('clsx') || id.includes('tailwind-merge'))
                            return 'vendor-style-utils';
                        if (id.includes('zustand')) return 'vendor-zustand';
                        if (id.includes('react-markdown')) return 'vendor-markdown';

                        return 'vendor-others'; // fallback for remaining vendor code
                    }

                    if (id.includes('src/components')) return 'components';
                    return null;
                },
            },
        },
    },
});
