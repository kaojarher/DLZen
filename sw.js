const C='cb-v7',A=['./','index.html','cards1.jpg','cards2.jpg','cards3.jpg','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>Promise.all(A.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
/* 網路優先：有網路時永遠取最新檔(換圖免改版本號)，離線時才用快取 */
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
/* 跨網域資源（背景音樂 MP3）與 Range 請求直接交給瀏覽器，不經 SW，避免 Safari 音訊問題與 206 快取錯誤 */
if(new URL(e.request.url).origin!==location.origin||e.request.headers.has('range'))return;
e.respondWith(fetch(e.request).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp))}return res}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))))});
