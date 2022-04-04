'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "243ddaa8220097a1ceb06a6cfeb145ca",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/images/5x5-700.png": "593bd63d76e4f9d1e05644ab77c81804",
"assets/images/bacakomuz1-700.png": "d347350563d682a8c54b279ac360a39e",
"assets/images/bacakomuz2-700.png": "37806f475df075e523d9253da4378b70",
"assets/images/bench-700.png": "5edc5f8de77a70872a82c071d0144bc4",
"assets/images/dips-700.png": "39a61318de9ea2d64c8e071aad4ae37c",
"assets/images/earkakol.JPG": "3d447688775b2f0c0b9acf7a6bd579e6",
"assets/images/ebacak.JPG": "f548c187266a90d99bbcd19b6a2fb00c",
"assets/images/ebiceps.JPG": "0eb6eaa1bb8cc967576d3e16b54c1516",
"assets/images/egogus.jpg": "d3666f834d3c4b0cb067605f614ec8dd",
"assets/images/ekardiyo.JPG": "f54457647d69659c30fa7de270deaab1",
"assets/images/ekarinkasi.JPG": "671c59043aebd58d99775fdb366c6a0c",
"assets/images/ekisisel.JPG": "f45a0c2b73bb771bbe08ea39a2ba44df",
"assets/images/eomuz.JPG": "93659b624e52bd1194e9a61298322c26",
"assets/images/es%25C4%25B1rt.JPG": "0cec7646cd4f6bf3b097918c6ea1ab04",
"assets/images/g%25C3%25BCn1-700.png": "3b7b03cd7776babd4544f51c66c94393",
"assets/images/g%25C3%25BCn2-700.png": "5e832276353973a06c5b7d531c7ec0f7",
"assets/images/g%25C3%25BCn3-700.png": "212f2ec8242ae2df8463f70ab0af950a",
"assets/images/gogusarkakol1-700.png": "37e159bd24f664aa9c18467baa504c7d",
"assets/images/gogusarkakol2-700.png": "5d6aef24ef3e3ee7f7f9400cec424630",
"assets/images/loginarkaplan.jpg": "2670f887ccc09a91ade5b3d99304d75d",
"assets/images/overheadpress-700.png": "a5ff46f3709183a1151d3d68cf942847",
"assets/images/row-700.png": "8a09c4ea8facc9305ab8cedba189e12d",
"assets/images/s%25C4%25B1rtarkakol1-700.png": "d521ccbfce7a04e64b076c656c253093",
"assets/images/s%25C4%25B1rtarkakol2-700.png": "4a67e79efafbc472912c2bd5db192687",
"assets/images/splashicon.jpg": "dd41f6b69b79818b1e40c5b9ebc961c3",
"assets/NOTICES": "dc6914256d011f7f8e6e16ee8d8eb4b2",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "a1b1abc11511f0d60cea607e199bec10",
"/": "a1b1abc11511f0d60cea607e199bec10",
"main.dart.js": "3574a9001b6976e152b946cb8def490c",
"manifest.json": "7f7ec01c041f05871a40f1cdb3f51f13",
"version.json": "ba71c2092fa10e7c32f36417182ba9a1"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
