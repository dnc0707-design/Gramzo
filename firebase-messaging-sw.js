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

// Firebase AUTOMATICALLY shows the notification if the payload contains 'notification'.
// Do NOT call showNotification manually here, or Android will block it!

// This listener simply ensures that if they tap the notification, it opens the Gramzo app.
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // If Gramzo is already open in a background tab, bring it to the front
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.indexOf('/') !== -1 && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise, open a new window to the app
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
