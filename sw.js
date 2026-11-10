// Ball Flight Finder service worker: lets the home-screen app open even with a weak signal at the range.
// Pages: network first, cached copy if offline. Icons and thumbnails: cache first. Videos are not cached.
const C="bff-v1";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","./pt/","./icons/icon-192.png"])).catch(()=>{}).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;
  const put=res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res};
  if(r.mode==="navigate"){
    e.respondWith(fetch(r).then(put).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match(u.pathname.includes("/pt/")?"./pt/":"./"))));
  }else if(/\.(png|jpg|webmanifest)$/.test(u.pathname)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(put)));
  }
});
