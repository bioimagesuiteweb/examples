//This is the "Offline copy of pages" service worker
// Creatd using www.pwabuilder.com

//Install stage sets up the index page (home page) in the cache and opens a new cache
self.addEventListener('install', function(event) {
    var indexPage = new Request('index.html');
    event.waitUntil(
        fetch(indexPage).then(function(response) {
            return caches.open('pwabuilder-offline').then(function(cache) {
                // console.log('[ServiceWroker] Cached index page during Install'+ response.url);
                return cache.put(indexPage, response);
            }).catch( (e) => {
                console.log(e);
            });
        }));
});
    

//If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener('fetch', function(event) {
    var updateCache = function(request){
        return caches.open('pwabuilder-offline').then(function (cache) {
            return fetch(request).then(function (response) {
                return cache.put(request, response);
            }).catch( (e) => {
                console.log(e);
            });
        });
    };

    event.waitUntil(updateCache(event.request));

    event.respondWith(
        fetch(event.request).catch(function(error) {
            // console.log( '[ServiceWroker] Network request Failed. Serving content from cache: ' + error );

            //Check to see if you have it in the cache
            //Return response
            //If not in the cache, then return error page
            return caches.open('pwabuilder-offline').then(function (cache) {
                return cache.match(event.request).then(function (matching) {
                    var report =  !matching || matching.status == 404?Promise.reject('no-match'): matching;
                    return report;
                }).catch( (e) => {
                    console.log(e);
                });
            }).catch( (e) => {
                console.log(e);
            });
        })
    );
});
