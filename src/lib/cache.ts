// Simple in-memory cache for API responses
interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

class APICache {
    private cache: Map<string, CacheEntry<unknown>> = new Map();
    private maxSize = 100;

    set<T>(key: string, data: T, ttlSeconds: number = 60): void {
        // Clean old entries if cache is too large
        if (this.cache.size >= this.maxSize) {
            this.cleanup();
        }

        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttlSeconds * 1000,
        });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) return null;

        // Check if expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    invalidate(pattern?: string): void {
        if (!pattern) {
            this.cache.clear();
            return;
        }

        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }

    private cleanup(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
            }
        }

        // If still too large, remove oldest entries
        if (this.cache.size >= this.maxSize) {
            const entries = Array.from(this.cache.entries())
                .sort((a, b) => a[1].timestamp - b[1].timestamp);

            const toRemove = entries.slice(0, this.maxSize / 2);
            for (const [key] of toRemove) {
                this.cache.delete(key);
            }
        }
    }
}

// Global singleton cache
const globalForCache = globalThis as unknown as { apiCache: APICache | undefined };
export const apiCache = globalForCache.apiCache ?? new APICache();
if (process.env.NODE_ENV !== 'production') globalForCache.apiCache = apiCache;

// Cache headers helper
export function getCacheHeaders(maxAge: number = 60, staleWhileRevalidate: number = 300) {
    return {
        'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    };
}
