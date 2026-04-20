import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'JR Club',
                short_name: 'JR Club',
                description: 'Sports activities, leagues, live scores, and rankings for Jasa Raharja.',
                theme_color: '#0056a4',
                background_color: '#f7f9fb',
                display: 'standalone',
                start_url: '/activities',
                icons: [
                    { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
                ],
            },
            workbox: {
                navigateFallback: '/activities',
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
            },
        }),
    ],
});
