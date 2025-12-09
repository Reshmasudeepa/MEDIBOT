importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAB5TldoIqRS_WfUlF7JYfVnzXi3i96dmw",
  authDomain: "medibot-457514.firebaseapp.com",
  projectId: "medibot-457514",
  messagingSenderId: "806828516267",
  appId: "1:806828516267:web:a75aad403f3dfbc67da8ee"
});

const messaging = firebase.messaging();

// Handle background messages (when app is not in focus)
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Background message received:', payload);
  
  const notificationTitle = payload.notification?.title || payload.data?.title || 'MediBot Reminder';
  const notificationBody = payload.notification?.body || payload.data?.body || 'You have a medication reminder';
  
  const notificationOptions = {
    body: notificationBody,
    icon: '/logo.png',
    badge: '/logo.png',
    tag: 'medication-reminder-' + Date.now(),
    requireInteraction: true,
    vibrate: [200, 100, 200],
    actions: [
      { action: 'taken', title: '✓ Taken' },
      { action: 'dismiss', title: '✗ Dismiss' }
    ],
    data: payload.data
  };

  console.log('[firebase-messaging-sw.js] Showing notification:', notificationTitle, notificationOptions);
  
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Notification clicked:', event.notification.data);
  
  event.notification.close();
  
  const action = event.action;
  const medicationData = event.notification.data;
  
  if (action === 'taken') {
    // Log medication taken
    console.log('[SW] Medication marked as taken:', medicationData?.medicationName);
    
    // You can add analytics or logging here
    if (medicationData?.medicationName) {
      // Speak confirmation (if supported)
      if ('speechSynthesis' in self) {
        const utterance = new SpeechSynthesisUtterance(`${medicationData.medicationName} marked as taken`);
        self.speechSynthesis.speak(utterance);
      }
    }
  } else if (action === 'dismiss') {
    console.log('[SW] Medication reminder dismissed');
  } else {
    // Default click action - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
        // If app is already open, focus it
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes('/medications') && 'focus' in client) {
            return client.focus();
          }
        }
        // If app is not open, open it
        if (clients.openWindow) {
          return clients.openWindow('/medications');
        }
      })
    );
  }
});

// Handle notification close event
self.addEventListener('notificationclose', function(event) {
  console.log('[SW] Notification closed:', event.notification.data);
});