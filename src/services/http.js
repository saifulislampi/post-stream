/**
 * HTTP Service - Axios wrapper with caching and error handling
 *
 * TODO:
 * - Add request/response interceptors for auth tokens
 * - Implement retry logic for 5xx errors
 * - Replace BASE with real backend URL
 * - Add POST/PUT methods when server is ready
 * - Consider service worker for offline caching
 */

import axios from "axios";

//Rubric B1 - Data in json file
export const BASE_URL = "";

// Create axios instance with default configuration
//Rubrice B2 - $http / axios in custom service
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// In-memory cache to avoid redundant requests
const cache = new Map();

/**
 * Cached GET request
 * @param {string} url - The endpoint URL
 * @param {Object} options - Additional options
 * @param {boolean} options.skipCache - Whether to bypass cache
 * @returns {Promise<any>} The response data
 */
export const get = async (url, { skipCache = false } = {}) => {
  const cacheKey = url;

  // Return cached data if available and not skipping cache
  if (!skipCache && cache.has(cacheKey)) {
    return Promise.resolve(cache.get(cacheKey));
  }

  try {
    const response = await api.get(url);

    // Cache successful responses
    cache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error(`GET request failed for ${url}:`, error.message);

    // Re-throw with additional context
    throw new Error(`Failed to fetch ${url}: ${error.message}`);
  }
};

/**
 * Clear cache for a specific URL or all cached data
 * @param {string} [url] - Specific URL to clear, or undefined to clear all
 */
export const clearCache = (url) => {
  if (url) {
    cache.delete(url);
  } else {
    cache.clear();
  }
};

/**
 * Get cache status information
 * @returns {Object} Cache information
 */
export const getCacheInfo = () => ({
  size: cache.size,
  keys: Array.from(cache.keys()),
});

// Request interceptor for future auth token handling
api.interceptors.request.use(
  (config) => {
    // TODO: Add auth token to headers when available
    // config.headers.Authorization = `Bearer ${getAuthToken()}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Add retry logic for 5xx errors
    // TODO: Handle auth token refresh on 401
    return Promise.reject(error);
  }
);
