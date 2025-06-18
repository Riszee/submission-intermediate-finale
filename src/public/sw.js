importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
);

workbox.core.setCacheNameDetails({
  prefix: "dicoding-story",
});

const APP_SHELL = [
  { url: "/", revision: "1" },
  { url: "/index.html", revision: "1" },
  { url: "/manifest.json", revision: "1" },
  { url: "/assets/index-D3miRxzZjs", revision: "1" },
  { url: "/assets/index-DtTHwIAY", revision: "1" },
  { url: "/icon-192.png", revision: "1" },
  { url: "/icon-512.png", revision: "1" },
  { url: "/icon-96.png", revision: "1" },
  { url: "/favicon.png", revision: "1" },
  { url: "/images/desktop.png", revision: "1" },
  { url: "/images/Bojji1.png", revision: "1" },
  { url: "/images/mobile.png", revision: "1" },
  { url: "https://unpkg.com/leaflet@1.9.3/dist/leaflet.css", revision: null },
  { url: "https://unpkg.com/leaflet@1.9.3/dist/leaflet.js", revision: null },
  {
    url: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
    revision: null,
  },
];

workbox.precaching.precacheAndRoute(APP_SHELL, {
  ignoreURLParametersMatching: [/.*/],
  directoryIndex: "/",
});

workbox.routing.registerRoute(
  ({ request }) => request.mode === "navigate",
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "pages",
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

workbox.routing.setCatchHandler(async ({ event }) => {
  if (event.request.mode === "navigate") {
    return caches.match("/index.html");
  }
  return Response.error();
});

workbox.routing.registerRoute(
  ({ url }) => url.origin === "https://story-api.dicoding.dev",
  new workbox.strategies.NetworkFirst({
    cacheName: "api-responses",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === "image",
  new workbox.strategies.CacheFirst({
    cacheName: "images",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({ request }) => ["script", "style"].includes(request.destination),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "assets",
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

self.addEventListener("push", (event) => {
  let data = { title: "Dicoding Story", body: "New story added!" };
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.options?.body || data.body,
    icon: "/icon-192.png",
    badge: "/icon-96.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: data.url || "/",
    },
  };
  if (Notification.permission === "granted") {
    event.waitUntil(self.registration.showNotification(data.title, options));
  } else {
    console.warn("Notification permission not granted.");
  }
});
