// Tick & Tape 1.0.4: keeps the app's own files for offline use. Written by build.js for each build; do not edit.
// PDFs are never fetched, so they never pass through here. A new version waits until the page asks it to take over (the Reload notice),
// or until every Tick & Tape window has been closed.
const CACHE = 'tick-and-tape-1.0.4-e421bd76f222', FILES = ["./","manifest.json","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","guide.html"];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {cache: 'reload'}))))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('tick-and-tape-') && k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => (await c.match(r, {ignoreSearch: true})) || (r.mode === 'navigate' ? c.match('./') : fetch(r))));
});
