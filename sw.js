const CACHE_NAME = 'ficha-rpg-v1';
const ASSETS = [
  './',
  './index.html',
  './stilus.css',
  './script.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. Instalação: Salva os arquivos no cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Ativação: Limpa caches antigos se houver atualização
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. Interceptação: Serve os arquivos do cache quando offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});