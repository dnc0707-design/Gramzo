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
messaging.onBackgroundMessage((payload) => {
    console.log('[SW] Background message received ', payload);
    const notificationTitle = payload.notification?.title || "Gramzo Update";
    const notificationOptions = {
        body: payload.notification?.body || "You have a new update.",
        icon: 'https://raw.githubusercontent.com/dnc0707-design/Gramzo/main/New%20logo%20-Gramzo%20-%206%20may.png',
        badge: 'https://raw.githubusercontent.com/dnc0707-design/Gramzo/main/New%20logo%20-Gramzo%20-%206%20may.png',
        vibrate: [200, 100, 200]
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.indexOf('/') !== -1 && 'focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow('/');
        })
    );
});

// --- 2. CACHING LOGIC ---
const CACHE_NAME = 'gramzo-cache-v2';
const urlsToCache = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
            );
        })
    );
});
