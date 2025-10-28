const VERSION = 'v0.8.5';
const CACHE_NAME = `cache-${VERSION}`;
const appfiles = [
    '/'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(appfiles).then(() => {
                console.log('Service Worker instalado y archivos en caché');
                return self.skipWaiting(); 
            });
        })
    );
});


            
                    
                    