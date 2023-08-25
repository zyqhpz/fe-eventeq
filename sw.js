/* eslint-disable no-undef */
// sw.js

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.1/workbox-sw.js')

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst()
)

// const CACHE_NAME = 'assets-cache-v1'
// const urlsToCache = [
//   /* Add paths to your static assets like CSS, JS, images, etc. */
//   '/src/index.css',
//   '/src/main.jsx',
//   '/src/App.jsx',
//   '/src/assets/error.png',
//   '/src/assets/EventEQ.png'
// ]

// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll(urlsToCache)
//     })
//   )
// })

// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request)
//     })
//   )
// })
