// Bioparque Temaikèn · mapa offline (Nexos)
const C='tmk-v3';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.add(new Request('/',{cache:'reload'}))).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
function put(k,res){if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(k,cp))}return res}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin===location.origin){
  if(u.searchParams.has('chk'))return;
  if(r.mode==='navigate'||u.pathname==='/'||u.pathname==='/index.html'){
   // con ?v= (actualización pedida): primero la red; si no, la copia guardada al instante y se renueva en segundo plano
   if(u.searchParams.has('v')){e.respondWith(fetch(r,{cache:'no-store'}).then(x=>put('/',x)).catch(()=>caches.match('/').then(m=>m||Response.error())));return}
   e.respondWith(caches.match('/').then(m=>{const net=fetch(r).then(x=>put('/',x)).catch(()=>m);if(m){e.waitUntil(net.then(()=>{}));return m}return net.then(x=>x||Response.error())}));return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>put(r,x))));return}
 if(/^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>put(r,x))));return}
});
