// src/utilities/offlineTimeTracking.js

import { createTimeTrackingEntry } from '../service/timeTrackingApi';

const PENDING_KEY = "pendingTimeTrackingActions";
const STORAGE_KEY = 'offlineTimeActions';
const LOCAL_QUEUE_KEY = 'pendingTimeTrackingActions';

export function addPendingAction(action) {
  // Try to send to service worker
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'queueApiRequest', action });
  } else {
    // Fallback: store in localStorage
    const existing = JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || '[]');
    existing.push(action);
    localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(existing));
  }
}

export function getPendingActions() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    // Request pending actions from service worker
    navigator.serviceWorker.controller.postMessage('getPendingCount');
    return [];
  } else {
    // Fallback: get from localStorage
    return JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || '[]');
  }
}

export function clearPendingActions() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'clearQueue' });
  } else {
    // Fallback: clear localStorage
    localStorage.removeItem(LOCAL_QUEUE_KEY);
  }
}

export function saveOfflineAction(action) {
  const actions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  actions.push(action);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
}

export function getOfflineActions() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function clearOfflineActions() {
  localStorage.removeItem(STORAGE_KEY);
}

// Enhanced function to handle offline time tracking with better timeEntryId management
export async function createTimeTrackingEntryOffline(timeEntryData) {
  if (navigator.onLine) {
    try {
      return await createTimeTrackingEntry(timeEntryData);
    } catch (error) {
      console.log(error);
      if (navigator.onLine) throw error;
    }
  }
  
  // Store timeEntryId in localStorage for offline clock-out
  if (timeEntryData.status === 'Clocked In') {
    localStorage.setItem('offlineClockInData', JSON.stringify({
      ...timeEntryData,
      timestamp: Date.now()
    }));
  }
  
  addPendingAction({
    type: 'clockIn',
    data: timeEntryData,
    timestamp: Date.now()
  });
  
  return { status: 'pending', message: 'Request queued for sync when online.' };
}

// New function to handle offline clock-out with timeEntryId
export function addOfflineClockOut(timeEntryId, clockOutData) {
  if (!timeEntryId) {
    // Try to get timeEntryId from localStorage
    const storedTimeEntryId = localStorage.getItem('currentTimeEntryId');
    if (!storedTimeEntryId) {
      throw new Error('No timeEntryId available for offline clock-out');
    }
    timeEntryId = storedTimeEntryId;
  }
  
  const action = {
    type: 'clockOut',
    data: {
      ...clockOutData,
      timeEntryId: timeEntryId
    },
    timestamp: Date.now()
  };
  
  addPendingAction(action);
  
  // Clear stored timeEntryId after queueing clock-out
  localStorage.removeItem('currentTimeEntryId');
  localStorage.removeItem('currentTimeEntryDate');
  
  return { status: 'pending', message: 'Clock-out queued for sync when online.' };
}

// Migrate localStorage queue to service worker when ready
export function migrateLocalQueueToSW() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    const pending = JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || '[]');
    if (pending.length > 0) {
      console.log(`Migrating ${pending.length} actions from localStorage to service worker`);
      pending.forEach(action => {
        navigator.serviceWorker.controller.postMessage({ type: 'queueApiRequest', action });
      });
    }
    // Always clear localStorage after migration attempt
    localStorage.removeItem(LOCAL_QUEUE_KEY);
    console.log('LocalStorage queue cleared');
  }
}

// Check if there are pending actions in localStorage
export function hasLocalPendingActions() {
  const pending = localStorage.getItem(LOCAL_QUEUE_KEY);
  return pending && JSON.parse(pending).length > 0;
}

// Get pending actions from localStorage
export function getLocalPendingActions() {
  return JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || '[]');
}

// Store timeEntryId for offline use
export function storeTimeEntryId(timeEntryId, dateString) {
  if (timeEntryId) {
    localStorage.setItem('currentTimeEntryId', timeEntryId);
    localStorage.setItem('currentTimeEntryDate', dateString);
  }
}

// Get stored timeEntryId
export function getStoredTimeEntryId() {
  return localStorage.getItem('currentTimeEntryId');
}

// Clear stored timeEntryId
export function clearStoredTimeEntryId() {
  localStorage.removeItem('currentTimeEntryId');
  localStorage.removeItem('currentTimeEntryDate');
}

// Check if user has an active clock-in (online or offline)
export function hasActiveClockIn() {
  const showClockButton = localStorage.getItem('showClockButton');
  return showClockButton === '1';
}

// Get offline clock-in data
export function getOfflineClockInData() {
  const data = localStorage.getItem('offlineClockInData');
  return data ? JSON.parse(data) : null;
}

// Clear offline clock-in data
export function clearOfflineClockInData() {
  localStorage.removeItem('offlineClockInData');
}

// Utility to generate a temporary offline ID (no external modules)
export function generateOfflineId() {
  return 'offline-' + Date.now() + '-' + Math.floor(Math.random() * 1000000);
}