// src/utils/cache.ts
type CachedValue = {
    value: string;
    expiresAt: number;
  };
  
const cache = new Map<string, CachedValue>();

const TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

export function setCache(key: string, value: string, ttl: number = TTL_MS): void {
cache.set(key, {
    value,
    expiresAt: Date.now() + ttl
});
}

export function getCache(key: string): string | null {
const cached = cache.get(key);
if (!cached) return null;

if (Date.now() > cached.expiresAt) {
    cache.delete(key);
    return null;
}

return cached.value;
}

export function clearCache(): void {
cache.clear();
}

export function deleteCacheKey(key: string): void {
cache.delete(key);
}
  