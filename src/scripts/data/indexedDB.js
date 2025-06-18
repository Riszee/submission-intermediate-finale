const DB_NAME = "diccoding-news-app-db";
const DB_VERSION = 1;
const STORE_NAME = "bookmarkedReports";

export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export async function saveStory(story) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.put(story);

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export async function getStories() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export async function deleteStory(id) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export async function isStoryBookmarked(id) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(!!request.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
