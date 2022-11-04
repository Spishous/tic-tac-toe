const cacheName='cache-4';
const base=location.protocol+"//"+location.host;
let filesToCache=[
    './',
    './?utm_source=homescreen',
    './circle.svg',
    './circle-h.svg',
    './Manifest.webmanifest',
    './rotate-left.svg',
    './vue.js',
    './xmark.svg',
    './xmark-h.svg',
    './style.css'
];
let include=[
    '*.css*',
    '*.woff*',
    '*.js',
    '*.svg',
    '*.png'
]

self.addEventListener('install',(e)=>{
    include=include.toString().replaceAll('*',')[\\S]*(').split(',')
    e.waitUntil(
        caches.open(cacheName).then((cache)=>{
            return cache.addAll(filesToCache);
        })
    );
})
self.addEventListener('fetch',(event)=>{
    event.respondWith(
        caches.match(event.request).then(function(response){
            if(!response){
                include.every((e)=>{
                    let reg=new RegExp('^('+e+')$')
                    if((event.request.url.trim()).match(reg)){
                        caches.open(cacheName).then((cache)=>{
                            return cache.add(event.request.url);
                        })
                        return false;
                    }
                    return true;
                })
                response=fetch(event.request);
            }
            return response;
        })
    )
})
self.addEventListener('activate',(event)=>{
    console.log('activate')
    clients.claim()
    event.waitUntil(
        caches.keys().then((cacheNames)=>{
            return Promise.all(
                cacheNames.filter((name)=>{
                    return name !== cacheName
                }).map((key)=>{
                    return caches.delete(key);
                })
            );
        })
    );
})
