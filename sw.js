// 1. Firebase Messaging Logic
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

const liveFirebaseConfig = {
    apiKey: "AIzaSyCA4U4jva7HHeMP-yk1VJy3l_BBct3Gohg",
    authDomain: "gramzo.firebaseapp.com",
    projectId: "gramzo",
    storageBucket: "gramzo.firebasestorage.app",
    messagingSenderId: "674262956986",
    appId: "1:674262956986:web:772f68694c77e15bf3fb83"
};

firebase.initializeApp(liveFirebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title || 'Gramzo Update';
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'logo-512.png',
    badge: 'logo-512.png',
    vibrate: [200, 100, 200]
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 2. Standard PWA Caching Logic
const CACHE_NAME = "gramzo-cache-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use catch here so missing files (like logo) don't crash the whole PWA install
      return cache.addAll(urlsToCache).catch(err => console.warn('Cache warning:', err));
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  // Do NOT intercept Firebase or Google Maps API calls
  if (event.request.url.includes('firestore') || event.request.url.includes('googleapis') || event.request.url.includes('firebase')) {
      return;
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
