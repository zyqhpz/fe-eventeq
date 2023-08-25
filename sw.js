/* eslint-disable */

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.1.1/workbox-sw.js"
);

const { routing, strategies } = workbox; // Destructure the workbox modules

workbox.routing.registerRoute(
  ({ request }) => request.destination === "image",
  new workbox.strategies.NetworkFirst()
);


/* eslint-enable */
