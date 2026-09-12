// Minimal service worker — just enough to make the app installable and to
// give a basic offline fallback. Deliberately "network-first": always fetches
// the latest deployed index.html when online, so nobody gets stuck on a
// stale cached version after we ship an update. Only falls back to the
// cached shell if the phone is genuinely offline.
const CACHE_NAME = "mypower-shell-v1";
const APP_SHELL = ["./", "./index.html"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("./index.html"))
    );
  }
});
