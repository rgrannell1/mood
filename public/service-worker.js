"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const local_1 = require("./ts/local");
const cached = [
//  '/',
//  '/css/style.css',
//  '/js/main.js',
//  '/favicon.ico'
];
const install = () => __awaiter(this, void 0, void 0, function* () {
    const cache = yield caches.open('sw-cache');
    yield cache.addAll(cached);
    return self.skipWaiting();
});
const fetchResponse = (event) => __awaiter(this, void 0, void 0, function* () {
    const cachedRes = yield caches.match(event.request);
    if (cachedRes) {
        return cachedRes;
    }
    const uncachedRes = yield fetch(event.request);
    const isUncacheable = !uncachedRes || uncachedRes.status !== 200 || uncachedRes.type !== 'basic';
    if (isUncacheable) {
        return uncachedRes;
    }
    const toCache = uncachedRes.clone();
    const cache = yield caches.open('sw-cache');
    cache.put(event.request, toCache);
    return uncachedRes;
});
console.log(`⛏ service-worker started`);
self.addEventListener('install', (event) => {
    console.log('⛏ installed');
    event.waitUntil(install());
});
self.addEventListener('fetch', (event) => {
    const isSameOrigin = event.request.url.startsWith(self.location.origin);
    event.respondWith(fetchResponse(event));
    console.log('⛏ fetch');
});
self.addEventListener('activate', event => {
    // -- remove old caches, when needed
    console.log('⛏ activated');
});
function sendEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        // generate a body from data in localstorage and send it on
        console.log(`⛏ syncing events to server`);
        const events = local_1.default.get('cached-events');
        const body = JSON.stringify({ events }, null, 2);
        return fetch('URL', {
            method: 'POST',
            body
        });
    });
}
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync') {
        event.waitUntil(sendEvents());
    }
});
//# sourceMappingURL=service-worker.js.map