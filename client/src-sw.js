// TODO: Create a service worker that caches static assets:
const { warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');


precacheAndRoute(self.__WB_MANIFEST);
// Set up page cache
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// Register route for caching dynamic CSS and JS files.
// i.e. bootstrap, jQuery, ...
// The StaleWhileRevalidate strategy serves content from cache AND loads it from source if needed.
// registerRoute(
//   ({ request }) => {
//     console.log(request);
//     return (
//       // CSS
//       request.destination === 'style' ||
//       // JavaScript
//       request.destination === 'script'
//     );
//   },
//   new StaleWhileRevalidate({
//     cacheName: 'static-resources',
//     plugins: [
//       new CacheableResponsePlugin({
//         statuses: [0, 200],
//       }),
//     ],
//   })
// );

// Register route for caching dynamic images
// The cache first strategy is often the best choice for images because it saves bandwidth and improves performance.
// registerRoute(
//   ({ request }) => request.destination === 'image',
//   new CacheFirst({
//     cacheName: 'my-image-cache',
//     plugins: [
//       new CacheableResponsePlugin({
//         statuses: [0, 200],
//       }),
//       new ExpirationPlugin({
//         maxEntries: 60,
//         maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
//       }),
//     ],
//   })
// );

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// Set up asset cache
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);