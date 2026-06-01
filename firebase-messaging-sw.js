importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCA4U4jva7HHeMP-yk1VJy3l_BBct3Gohg",
    authDomain: "gramzo.firebaseapp.com",
    projectId: "gramzo",
    storageBucket: "gramzo.firebasestorage.app",
    messagingSenderId: "674262956986",
    appId: "1:674262956986:web:772f68694c77e15bf3fb83"
});

const messaging = firebase.messaging();

// --- 1. BACKGROUND PUSH NOTIFICATIONS ---
// If the backend sends a "notification" object, the browser handles it automatically.
// We only call showNotification manually if ONLY a "data" object was received.
messaging.onBackgroundMessage((payload) => {
    console.log('[SW] Background message received ', payload);
    
    if (!payload.notification && payload.data) {
        const notificationTitle = payload.data.title || "Gramzo Update";
        const notificationOptions = {
            body: payload.data.body || "You have a new update.",
            icon: 'https://raw.githubusercontent.com/dnc0707-design/Gramzo/main/New%20logo%20-Gramzo%20-%206%20may.png',
            badge: 'https://raw.githubusercontent.com/dnc0707-design/Gramzo/main/New%20logo%20-Gramzo%20-%206%20may.png',
            vibrate: [300, 100, 300, 100, 300], // Swiggy style aggressive vibration
            requireInteraction: true, // Keeps it on screen
            data: {
                click_action: payload.data.click_action || '/'
            }
        };
        return self.registration.showNotification(notificationTitle, notificationOptions);
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = event.notification.data?.click_action || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});

// --- 2. CRASH-PROOF CACHING LOGIC ---
const CACHE_NAME = 'gramzo-cache-v4'; // Bumped cache version
const urlsToCache = ['/', '/index.html'];

self.addEventListener('install', event => {
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            try {
                await cache.addAll(urlsToCache);
                console.log('[SW] Caching successful');
            } catch (err) {
                console.warn('[SW] Caching partially failed, but SW will continue running.', err);
            }
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
            );
        })
    );
});
