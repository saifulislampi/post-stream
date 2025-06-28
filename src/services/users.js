/**
 * Users service - handles user data and authentication
 *
 * TODO:
 * - Add register() and updateProfile() methods
 * - Implement login() with hashed passwords and tokens
 * - Add avatar upload functionality
 */
import { get } from "./http.js";

// Module-level cache for users data
let usersCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Checks if the cache is still valid
 * @returns {boolean} True if cache is valid
 */
const isCacheValid = () => {
  return (
    usersCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION
  );
};

/**
 * Fetches all users with intelligent caching
 * @param {Object} options - Fetch options
 * @param {boolean} options.forceRefresh - Whether to bypass cache
 * @returns {Promise<Array>} Array of all users
 */
export const fetchUsers = async ({ forceRefresh = false } = {}) => {
  try {
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && isCacheValid()) {
      return Promise.resolve(usersCache);
    }

    const users = await get("data/users.json");

    // Update cache
    usersCache = users;
    cacheTimestamp = Date.now();

    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);

    // Return cached data as fallback if available
    if (usersCache) {
      console.warn("Returning cached users data due to fetch error");
      return usersCache;
    }

    throw error;
  }
};

/**
 * Fetches a specific user by ID
 * @param {string|number} userId - The ID of the user
 * @returns {Promise<Object|null>} The user object or null if not found
 */
export const fetchUserById = async (userId) => {
  try {
    const users = await fetchUsers();
    return users.find((user) => user.id === Number(userId)) || null;
  } catch (error) {
    console.error(`Failed to fetch user with ID ${userId}:`, error);
    throw error;
  }
};

/**
 * Fetches multiple users by their IDs
 * @param {Array<string|number>} userIds - Array of user IDs
 * @returns {Promise<Array>} Array of user objects (may be shorter than input if some users not found)
 */
export const fetchUsersByIds = async (userIds) => {
  try {
    const users = await fetchUsers();
    const userIdNumbers = userIds.map((id) => Number(id));

    return users.filter((user) => userIdNumbers.includes(user.id));
  } catch (error) {
    console.error("Failed to fetch users by IDs:", error);
    throw error;
  }
};

/**
 * Searches users by name or email
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @param {boolean} options.caseSensitive - Whether search should be case sensitive
 * @returns {Promise<Array>} Array of matching users
 */
export const searchUsers = async (query, { caseSensitive = false } = {}) => {
  try {
    const users = await fetchUsers();
    const searchQuery = caseSensitive ? query : query.toLowerCase();

    return users.filter((user) => {
      const name = caseSensitive ? user.name : user.name?.toLowerCase();
      const email = caseSensitive ? user.email : user.email?.toLowerCase();

      return name?.includes(searchQuery) || email?.includes(searchQuery);
    });
  } catch (error) {
    console.error("Failed to search users:", error);
    throw error;
  }
};

/**
 * Clears the users cache
 */
export const clearUsersCache = () => {
  usersCache = null;
  cacheTimestamp = null;
};

/**
 * Gets cache information for debugging
 * @returns {Object} Cache status information
 */
export const getCacheInfo = () => ({
  hasCachedData: !!usersCache,
  cacheTimestamp,
  isValid: isCacheValid(),
  userCount: usersCache?.length || 0,
});
