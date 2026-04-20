self.addEventListener('install', (event) => {
    event.waitUntil(caches.open('jrclub-shell-v1').then((cache) => cache.addAll(['/activities'])));
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(fetch(event.request).catch(() => caches.match('/activities')));
    }
});

self.addEventListener('push', (event) => {
    const data = event.data?.json() ?? { title: 'JR Club', body: 'You have a new update.' };
    event.waitUntil(self.registration.showNotification(data.title, { body: data.body, icon: '/favicon.ico' }));
});
