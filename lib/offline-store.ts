// Simplified IndexedDB wrapper for offline storage
const DB_NAME = 'mrv_field_data';
const DB_VERSION = 1;

export const initDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof window === 'undefined') return;
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('plots')) {
        db.createObjectStore('plots', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('trees')) {
        const treeStore = db.createObjectStore('trees', { keyPath: 'id' });
        treeStore.createIndex('plot_id', 'plot_id', { unique: false });
      }
    };
  });
};

export const savePlot = async (plot: any) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('plots', 'readwrite');
    const store = tx.objectStore('plots');
    store.put({ ...plot, synced: false, updated_at: new Date().toISOString() });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

// ... other methods omitted for brevity in template, would include saveTree, getPending, etc.
