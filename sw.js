const CACHE_NAME = 'gramzo-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/ride.html',
  '/manifest.json'
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


// ============================================================================
// --- FIREBASE PUSH NOTIFICATIONS BACKGROUND WORKER ---
// ============================================================================

importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
    apiKey: "AIzaSyCA4U4jva7HHeMP-yk1VJy3l_BBct3Gohg",
    authDomain: "gramzo.firebaseapp.com",
    projectId: "gramzo",
    storageBucket: "gramzo.firebasestorage.app",
    messagingSenderId: "674262956986",
    appId: "1:674262956986:web:772f68694c77e15bf3fb83"
});

const messaging = firebase.messaging();

// Handle background messages (When the app is closed)
messaging.onBackgroundMessage(function(payload) {
    console.log('[sw.js] Received background message ', payload);
    
    const notificationTitle = payload.notification ? payload.notification.title : 'Gramzo Update';
    const notificationOptions = {
        body: payload.notification ? payload.notification.body : 'Open the app to see details.',
        icon: 'https://raw.githubusercontent.com/dnc0707-design/Gramzo/main/New%20logo%20-Gramzo%20-%206%20may.png',
        badge: 'https://raw.githubusercontent.com/dnc0707-design/Gramzo/main/New%20logo%20-Gramzo%20-%206%20may.png',
        vibrate: [200, 100, 200], // Vibration pattern for Android
        data: payload.data || {} // Pass any extra data (like order ID)
    };

    // This pops up the actual Android notification when the app is closed
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle what happens when the user taps the background notification
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://gramzo.in/') // Make sure this is your actual live domain!
    );
});
