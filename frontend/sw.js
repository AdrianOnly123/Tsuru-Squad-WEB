const VERSION = "v0.8.5";
const CACHE_NAME = `cache-${VERSION}`;
const appshell = [
  "/",
  "/index.html",
  "/register.html",
  "/welcome.html",
  "/dashboard-scienist.html",
  "/dashboard-farmer.html",
  "/detalle-proyecto.html",
  "/styles.css",
  "/js/login.js",
  "/js/register.js",
  "/js/welcome.js",
  "/js/detalle-proyecto.js",
  "/js/dashboard-scientist.js",
  "/js/dashboard-farmer.js",
  "/public/img/biofertilizante.png",
  "/public/img/humedad.png",
  "/public/img/recomendaciones.png",
  "/public/img/semaforo.png",
  "/public/img/semillas.png",
  "/public/manifest.json",
  "https://cdn.jsdelivr.net/npm/chart.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(appshell).then(() => {
        console.log("✅ Service Worker instalado y archivos cacheados");
        return self.skipWaiting();
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        );
      })
      .then(() => {
        console.log("🔄 Service Worker activado y cachés antiguas eliminadas");
        return self.clients.claim(); // tomar control de las páginas
      })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => caches.match(event.request))
  );
});
