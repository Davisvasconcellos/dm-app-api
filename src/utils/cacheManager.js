/**
 * Centralized Cache Manager
 * 
 * Allows different routes to share and invalidate caches.
 * Useful for cross-route invalidation (e.g., approving a suggestion clears the Kanban cache).
 */

const caches = {
  jams: new Map(),
  suggestions: new Map()
};

const TTLs = {
  jams: 30000, // 30 seconds
  suggestions: 15000 // 15 seconds
};

/**
 * Clear cache by key prefix (usually eventIdCode)
 */
const clearCacheByPrefix = (cacheName, prefix) => {
  const cache = caches[cacheName];
  if (!cache || !prefix) return;

  if (process.env.NODE_ENV === 'development') {
    console.log(`[CacheManager] Clearing '${cacheName}' for prefix: ${prefix}`);
  }

  for (const key of cache.keys()) {
    if (key.startsWith(`${prefix}-`)) {
      cache.delete(key);
    }
  }
};

module.exports = {
  jamsCache: caches.jams,
  suggestionsCache: caches.suggestions,
  clearJamsCache: (eventId) => clearCacheByPrefix('jams', eventId),
  clearSuggestionsCache: (eventId) => clearCacheByPrefix('suggestions', eventId),
  JAMS_CACHE_TTL: TTLs.jams,
  SUGGESTIONS_CACHE_TTL: TTLs.suggestions
};
