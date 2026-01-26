const workbox = require('workbox-build');
const path = require('path');

(async () => {
  const swDest = path.join(process.cwd(), 'sw.js');
  const build = await workbox.generateSW({
    swDest,
    globDirectory: process.cwd(),
    globPatterns: [
      'index.html',
      'css/**.min.css',
      'js/**.min.js',
      'images/**.*',
      'videos/**.*'
    ],
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    runtimeCaching: [
      {
        urlPattern: /\/images\//,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images-cache',
          expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }
        }
      },
      {
        urlPattern: /\/js\//,
        handler: 'StaleWhileRevalidate',
        options: { cacheName: 'js-cache' }
      }
    ]
  });
  console.log('Service worker generated:', build.swDest);
})();
