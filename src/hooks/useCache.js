// src/hooks/useCache.js
// Cache des recettes déjà chargées pour le mode hors-ligne

const CACHE_KEY = 'mf_cache';
const MAX_ITEMS = 50;

function loadCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); }
  catch { return {}; }
}

function saveCache(cache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); }
  catch {}
}

export function getCached(id) {
  const cache = loadCache();
  return cache[id] || null;
}

export function setCache(meal) {
  const cache = loadCache();
  cache[meal.idMeal] = { ...meal, _cachedAt: Date.now() };
  // Garder seulement les MAX_ITEMS plus récents
  const keys = Object.keys(cache);
  if (keys.length > MAX_ITEMS) {
    const oldest = keys.sort((a, b) => (cache[a]._cachedAt || 0) - (cache[b]._cachedAt || 0));
    delete cache[oldest[0]];
  }
  saveCache(cache);
}

export function clearCache() {
  try { localStorage.removeItem(CACHE_KEY); }
  catch {}
}