
// shared/status/cacheRegistry.ts
type CacheKeyMatcher = (key: string) => boolean;

export interface CacheConfig {
    match: CacheKeyMatcher;
    expire: (key: string, store: unknown) => void;
    ttl?: number; // optional default TTL
}

export const cacheRegistry: CacheConfig[] = [];

export const registerCache = (match: CacheKeyMatcher, expire: CacheConfig['expire'], ttl?: number) => {
    cacheRegistry.push({ match, expire, ttl });
};

