const CACHE_NAME = 'fy-app-cache-v1';
const API_QUEUE_KEY = 'offline-api-queue';
const TIME_TRACKING_API_PATTERN = /\/recruitment\/time-tracking/;

// List of URLs to cache (add more as needed)
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/manifest.json',
  // Add more static assets as needed
];

// IndexedDB helpers for queueing API requests
const DB_NAME = 'fy-offline-db';
const STORE_NAME = 'api-queue';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'timestamp' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function addToQueue(item) {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).add(item);
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  });
}

function getQueue() {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = reject;
    });
  });
}

function clearQueue() {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).clear();
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  });
}

function notifyClientsQueueLength(length) {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: 'pendingActionsCount', count: length });
    });
  });
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Update queueApiRequest to notify clients
function queueApiRequest(request) {
  request.clone().json().then((body) => {
    addToQueue({
      url: request.url,
      method: request.method,
      body,
      headers: [...request.headers],
      timestamp: Date.now(),
    }).then(() => {
      getQueue().then((queue) => notifyClientsQueueLength(queue.length));
    });
  });
}

// Update syncApiQueue to only send actions to main app, do not clear the queue here
async function syncApiQueue() {
  const queue = await getQueue();
  if (queue.length > 0) {
    // Send all queued actions to the main app for processing
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ 
          type: 'processQueuedActions', 
          actions: queue 
        });
      });
    });
  }
  // Do NOT clear the queue here; only clear when main app confirms
}

// Listen for fetch events
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  // Handle time tracking API requests
  if (TIME_TRACKING_API_PATTERN.test(url) && (request.method === 'POST' || request.method === 'PUT')) {
    if (!navigator.onLine) {
      // If offline, queue the request
      event.respondWith(
        (async () => {
          queueApiRequest(request);
          return new Response(JSON.stringify({
            status: 'pending',
            message: 'Request queued for sync when online.'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })()
      );
      return;
    }
  }

  // Cache-first for static assets
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request);
      })
    );
  }
});

// Listen for online event to sync API queue
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-api-queue') {
    event.waitUntil(syncApiQueue());
  }
});

// Listen for messages from the main app
self.addEventListener('message', (event) => {
  if (event.data === 'syncApiQueue') {
    syncApiQueue();
  } else if (event.data === 'getPendingCount') {
    getQueue().then((queue) => notifyClientsQueueLength(queue.length));
  } else if (event.data && event.data.type === 'queueApiRequest') {
    // Handle actions sent from the main app
    const action = event.data.action;
    if (action.type === 'clockIn') {
      // Store the action data for later sync
      const requestData = {
        type: 'clockIn',
        data: action.data,
        timestamp: action.timestamp || Date.now(),
      };
      addToQueue(requestData).then(() => {
        getQueue().then((queue) => notifyClientsQueueLength(queue.length));
      });
    } else if (action.type === 'clockOut') {
      // Store the action data for later sync
      const requestData = {
        type: 'clockOut',
        data: action.data,
        timestamp: action.timestamp || Date.now(),
      };
      addToQueue(requestData).then(() => {
        getQueue().then((queue) => notifyClientsQueueLength(queue.length));
      });
    }
  } else if (event.data && event.data.type === 'clearQueueAndAddFailed') {
    // Clear the queue and add back failed actions
    clearQueue().then(() => {
      const failedActions = event.data.failedActions || [];
      const promises = failedActions.map(action => addToQueue(action));
      Promise.all(promises).then(() => {
        getQueue().then((queue) => notifyClientsQueueLength(queue.length));
      });
    });
  } else if (event.data && event.data.type === 'clearQueue') {
    // Clear the entire queue
    clearQueue().then(() => {
      notifyClientsQueueLength(0);
    });
  }
});

// Optionally, try to sync on startup
self.addEventListener('activate', (event) => {
  event.waitUntil(syncApiQueue());
}); 