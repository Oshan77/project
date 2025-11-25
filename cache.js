const cache = new Map();
const MAX_SIZE = 50; 
const EXPIRY_MS = 1000 * 60 * 30; // 30 minutes

export function setCache(key, value) {
    if (cache.size >= MAX_SIZE) {
        const oldest = cache.keys().next().value;
        cache.delete(oldest);
    }
    cache.set(key, { value, timestamp: Date.now() });
}

export function getCache(key) {
    const item = cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > EXPIRY_MS) {
        cache.delete(key);
        return null;
    }
    return item.value;
}
