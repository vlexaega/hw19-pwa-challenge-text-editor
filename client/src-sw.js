// // const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
// const { CacheFirst } = require('workbox-strategies');
// const { registerRoute } = require('workbox-routing');
// const { CacheableResponsePlugin } = require('workbox-cacheable-response');
// const { ExpirationPlugin } = require('workbox-expiration');
// // const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

// // precacheAndRoute(self.__WB_MANIFEST);

// const pageCache = new CacheFirst({
//   cacheName: 'page-cache',
//   plugins: [
//     new CacheableResponsePlugin({
//       statuses: [0, 200],
//     }),
//     new ExpirationPlugin({
//       maxAgeSeconds: 30 * 24 * 60 * 60,
//     }),
//   ],
// });

// warmStrategyCache({
//   urls: ['/index.html', '/'],
//   strategy: pageCache,
// });

// // image caching route
// registerRoute(
//   /\.(?:png|jpg|jpeg|svg|gif|ico)$/,
//   new CacheFirst({
//     cacheName: 'image-cache',
//     plugins: [
//       new CacheableResponsePlugin({
//         statuses: [0, 200],
//       }),
//       new ExpirationPlugin({
//         maxEntries: 50,
//         maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
//       }),
//     ],
//   })
// );

// // asset caching route
// registerRoute(
//   /\.(?:js|css)$/,
//   new CacheFirst({
//     cacheName: 'asset-cache',
//     plugins: [
//       new CacheableResponsePlugin({
//         statuses: [0, 200],
//       }),
//       new ExpirationPlugin({
//         maxEntries: 20,
//         maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
//       }),
//     ],
//   })
// );

// TODO: Create a service worker that caches static assets:
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Import the expiration plugin
import { ExpirationPlugin } from 'workbox-expiration';

precacheAndRoute(self.__WB_MANIFEST);

// Register route for caching dynamic CSS and JS files.
// i.e. bootstrap, jQuery, ...
// The StaleWhileRevalidate strategy serves content from cache AND loads it from source if needed.
registerRoute(
  ({ request }) => {
    console.log(request);
    return (
      // CSS
      request.destination === 'style' ||
      // JavaScript
      request.destination === 'script'
    );
  },
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Register route for caching dynamic images
// The cache first strategy is often the best choice for images because it saves bandwidth and improves performance.
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'my-image-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

