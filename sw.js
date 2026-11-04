// Bioparque Temaikèn · mapa offline (Nexos)
const C='tmk-v2';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.add('/')).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
function put(k,res){if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(k,cp))}return res}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin===location.origin){
  if(u.searchParams.has('chk'))return;
  if(r.mode==='navigate'||u.pathname==='/'||u.pathname==='/index.html'){
   e.respondWith(new Promise(res=>{let done=false;const fb=()=>caches.match('/').then(m=>{if(!done&&m){done=true;res(m)}return m});
    const t=setTimeout(fb,3500);
    fetch(r).then(x=>{put('/',x);if(!done){done=true;clearTimeout(t);res(x)}}).catch(()=>fb().then(m=>{if(!done){done=true;res(m||Response.error())}}))}));return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>put(r,x))));return}
 if(/^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>put(r,x))));return}
});
