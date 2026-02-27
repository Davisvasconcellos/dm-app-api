const { AsyncLocalStorage } = require('async_hooks');

// Storage to keep track of the current request context (route, IP, etc.)
// This allows the database hooks to know WHICH route triggered a query.
const requestContext = new AsyncLocalStorage();

/**
 * Helper to increment metrics in the current request context
 * @param {string} metricName - Name of the metric to increment ('dbQueries', 'cacheHits')
 * @param {number} value - Value to increment by (default 1)
 */
const incrementMetric = (metricName, value = 1) => {
  const store = requestContext.getStore();
  if (store && store[metricName] !== undefined) {
    store[metricName] += value;
    if (metricName === 'cacheHits' && process.env.NODE_ENV === 'development') {
      console.log(`[Metric] Hit! Rota: ${store.routeKey}, IP: ${store.ip}`);
    }
  } else if (process.env.NODE_ENV === 'development') {
    console.warn(`[Metric] Aviso: Tentativa de incrementar '${metricName}' mas store é null.`);
  }
};

module.exports = { requestContext, incrementMetric };
