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

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://raw.githubusercontent.com/dnc0707-design/Gramzo/main/New%20logo%20-Gramzo%20-%206%20may.png',
        badge: 'https://raw.githubusercontent.com/dnc0707-design/Gramzo/main/New%20logo%20-Gramzo%20-%206%20may.png',
        data: payload.data || {},
        vibrate: [200, 100, 200, 100, 200, 100, 200]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
