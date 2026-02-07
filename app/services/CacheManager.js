/**
 * CacheManager - Sistema Caching Multi-Layer
 * 
 * Layers:
 * 1. Memory Cache (veloce, volatile)
 * 2. AsyncStorage Cache (persistente, più lento)
 * 
 * Features:
 * - TTL (Time To Live) configurabile
 * - Invalidazione automatica
 * - Strategie: cache-first, network-first, stale-while-revalidate
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurazione TTL per tipo di dato (in ms)
const DEFAULT_TTL = {
  visionData: 1000 * 60 * 30,      // 30 minuti
  listingData: 1000 * 60 * 60,     // 1 ora
  inventory: 1000 * 60 * 5,        // 5 minuti
  userProfile: 1000 * 60 * 60 * 24, // 24 ore
};

// Memory cache (in-memory object)
const memoryCache = new Map();

/**
 * Genera chiave cache univoca
 */
const getCacheKey = (prefix, identifier) => {
  return `@SellSnap:${prefix}:${identifier}`;
};

/**
 * Verifica se entry cache è valida (non scaduta)
 */
const isExpired = (timestamp, ttl) => {
  return Date.now() - timestamp > ttl;
};

/**
 * LAYER 1: Memory Cache Operations
 */
class MemoryCache {
  static set(key, value, ttl) {
    memoryCache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
    });
  }

  static get(key) {
    const entry = memoryCache.get(key);

    if (!entry) return null;

    if (isExpired(entry.timestamp, entry.ttl)) {
      memoryCache.delete(key);
      return null;
    }

    return entry.value;
  }

  static invalidate(key) {
    memoryCache.delete(key);
  }

  static clear() {
    memoryCache.clear();
  }
}

/**
 * LAYER 2: AsyncStorage Cache Operations
 */
class PersistentCache {
  static async set(key, value, ttl) {
    try {
      const entry = {
        value,
        timestamp: Date.now(),
        ttl,
      };
      await AsyncStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.warn('[PersistentCache] Set failed:', error);
    }
  }

  static async get(key) {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;

      const entry = JSON.parse(raw);

      if (isExpired(entry.timestamp, entry.ttl)) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return entry.value;
    } catch (error) {
      console.warn('[PersistentCache] Get failed:', error);
      return null;
    }
  }

  static async invalidate(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn('[PersistentCache] Invalidate failed:', error);
    }
  }

  static async clear() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const sellSnapKeys = keys.filter(k => k.startsWith('@SellSnap:'));
      await AsyncStorage.multiRemove(sellSnapKeys);
    } catch (error) {
      console.warn('[PersistentCache] Clear failed:', error);
    }
  }
}

/**
 * PUBLIC API - Unified Cache Manager
 */
export class CacheManager {
  /**
   * Cache-First Strategy
   * 1. Check memory cache
   * 2. Check persistent cache
   * 3. Execute fetcher se nessun hit
   * 4. Popola entrambi i layer
   */
  static async cacheFirst(prefix, identifier, fetcher, ttl = DEFAULT_TTL[prefix]) {
    const key = getCacheKey(prefix, identifier);

    // Layer 1: Memory
    let cached = MemoryCache.get(key);
    if (cached) {
      console.log('[CacheManager] Memory hit:', key);
      return cached;
    }

    // Layer 2: Persistent
    cached = await PersistentCache.get(key);
    if (cached) {
      console.log('[CacheManager] Persistent hit:', key);
      // Ripopola memory cache
      MemoryCache.set(key, cached, ttl);
      return cached;
    }

    // Cache miss: fetch fresh data
    console.log('[CacheManager] Cache miss, fetching:', key);
    const freshData = await fetcher();

    // Popola entrambi i layer
    MemoryCache.set(key, freshData, ttl);
    await PersistentCache.set(key, freshData, ttl);

    return freshData;
  }

  /**
   * Network-First Strategy
   * 1. Esegui fetcher
   * 2. Se successo, aggiorna cache
   * 3. Se fallisce, fallback a cache (anche se stale)
   */
  static async networkFirst(prefix, identifier, fetcher, ttl = DEFAULT_TTL[prefix]) {
    const key = getCacheKey(prefix, identifier);

    try {
      console.log('[CacheManager] Network-first fetch:', key);
      const freshData = await fetcher();

      // Aggiorna cache
      MemoryCache.set(key, freshData, ttl);
      await PersistentCache.set(key, freshData, ttl);

      return freshData;
    } catch (error) {
      console.warn('[CacheManager] Network fetch failed, trying cache:', error);

      // Fallback a cache (ignora TTL in caso di errore network)
      let cached = MemoryCache.get(key);
      if (!cached) {
        cached = await PersistentCache.get(key);
      }

      if (cached) {
        console.log('[CacheManager] Using stale cache as fallback');
        return cached;
      }

      // Nessuna cache disponibile, rilancia errore
      throw error;
    }
  }

  /**
   * Stale-While-Revalidate Strategy
   * 1. Restituisci immediatamente da cache (anche se stale)
   * 2. In background, fetch fresh data e aggiorna cache
   * 3. Ottimale per UX veloce con dati non critici
   */
  static async staleWhileRevalidate(prefix, identifier, fetcher, ttl = DEFAULT_TTL[prefix]) {
    const key = getCacheKey(prefix, identifier);

    // Restituisci subito cache se disponibile
    let cached = MemoryCache.get(key);
    if (!cached) {
      cached = await PersistentCache.get(key);
      if (cached) {
        MemoryCache.set(key, cached, ttl);
      }
    }

    // Revalidate in background (non blocca return)
    fetcher()
      .then(freshData => {
        MemoryCache.set(key, freshData, ttl);
        PersistentCache.set(key, freshData, ttl);
        console.log('[CacheManager] Background revalidation complete:', key);
      })
      .catch(error => {
        console.warn('[CacheManager] Background revalidation failed:', error);
      });

    // Se cache non disponibile, aspetta fetcher
    if (!cached) {
      console.log('[CacheManager] No cache, waiting for fetcher');
      cached = await fetcher();
      MemoryCache.set(key, cached, ttl);
      await PersistentCache.set(key, cached, ttl);
    }

    return cached;
  }

  /**
   * Invalidazione manuale
   */
  static async invalidate(prefix, identifier) {
    const key = getCacheKey(prefix, identifier);
    MemoryCache.invalidate(key);
    await PersistentCache.invalidate(key);
    console.log('[CacheManager] Invalidated:', key);
  }

  /**
   * Clear completo (logout, reset app)
   */
  static async clearAll() {
    MemoryCache.clear();
    await PersistentCache.clear();
    console.log('[CacheManager] All caches cleared');
  }

  /**
   * Preload: popola cache preventivamente
   */
  static async preload(prefix, identifier, data, ttl = DEFAULT_TTL[prefix]) {
    const key = getCacheKey(prefix, identifier);
    MemoryCache.set(key, data, ttl);
    await PersistentCache.set(key, data, ttl);
    console.log('[CacheManager] Preloaded:', key);
  }
}

/**
 * Hook-like wrappers per uso con React
 */

/**
 * Wrapper per Vision API con cache
 */
export const getCachedVisionData = (imageHash, fetcher) => {
  return CacheManager.cacheFirst('visionData', imageHash, fetcher);
};

/**
 * Wrapper per Listing API con cache
 */
export const getCachedListingData = (visionDataHash, fetcher) => {
  return CacheManager.cacheFirst('listingData', visionDataHash, fetcher);
};

/**
 * Wrapper per Inventory con stale-while-revalidate
 * (inventory cambia spesso, ma ok mostrare dati leggermente vecchi)
 */
export const getCachedInventory = (userId, fetcher) => {
  return CacheManager.staleWhileRevalidate('inventory', userId, fetcher);
};

/**
 * Utility: genera hash da oggetto (per cache key)
 */
export const hashObject = (obj) => {
  const str = JSON.stringify(obj);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};
