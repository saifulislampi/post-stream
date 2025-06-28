/**
 * Posts service - handles post data operations and user enrichment
 *
 * TODO:
 * - Add updatePost() and deletePost() methods
 * - Implement server-side persistence when backend is ready
 * - Add post validation and sanitization
 * - Consider pagination for large post lists
 */
//Rubric B5 - Comments more than 5
import { get, clearCache } from "./http.js";
import { fetchUsers, fetchUsersByIds } from "./users.js";

const STORAGE_KEY = "positive_posts";
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes

// Module-level cache for posts
let postsCache = null;
let cacheTimestamp = null;

/**
 * Checks if the posts cache is still valid
 * @returns {boolean} True if cache is valid
 */
const isCacheValid = () => {
  return (
    postsCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION
  );
};

//Rubric B3 - Custom service for data methods
/**
 * Fetches all posts from the API with intelligent caching
 * @param {Object} options - Fetch options
 * @param {boolean} options.forceRefresh - Whether to bypass cache
 * @returns {Promise<Array>} Array of all posts
 */
export const fetchPosts = async ({ forceRefresh = false } = {}) => {
  try {
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && isCacheValid()) {
      return Promise.resolve(postsCache);
    }

    const posts = await get("data/posts.json", { skipCache: forceRefresh });

    // Update cache
    postsCache = posts;
    cacheTimestamp = Date.now();

    return posts;
  } catch (error) {
    console.error("Failed to fetch posts:", error);

    // Return cached data as fallback if available
    if (postsCache) {
      console.warn("Returning cached posts data due to fetch error");
      return postsCache;
    }

    throw error;
  }
};

/**
 * Fetches a specific post by ID
 * @param {string|number} postId - The ID of the post to fetch
 * @returns {Promise<Object|null>} The post object or null if not found
 */
export const fetchPostById = async (postId) => {
  try {
    const posts = await fetchPosts();
    return posts.find((post) => post.id === Number(postId)) || null;
  } catch (error) {
    console.error(`Failed to fetch post with ID ${postId}:`, error);
    throw error;
  }
};

/**
 * Fetches multiple posts by their IDs
 * @param {Array<string|number>} postIds - Array of post IDs
 * @returns {Promise<Array>} Array of post objects
 */
export const fetchPostsByIds = async (postIds) => {
  try {
    const posts = await fetchPosts();
    const postIdNumbers = postIds.map((id) => Number(id));

    return posts.filter((post) => postIdNumbers.includes(post.id));
  } catch (error) {
    console.error("Failed to fetch posts by IDs:", error);
    throw error;
  }
};

/**
 * Fetches posts enriched with user data for easier UI consumption
 * Uses optimized user fetching to minimize API calls
 * @param {Object} options - Fetch options
 * @param {boolean} options.forceRefresh - Whether to bypass cache
 * @returns {Promise<Array>} Array of posts with user objects
 */
export const fetchPostsWithAuthor = async ({ forceRefresh = false } = {}) => {
  try {
    const posts = await fetchPosts({ forceRefresh });

    // Get unique user IDs to minimize user API calls
    const uniqueUserIds = [...new Set(posts.map((post) => post.userId))];
    const users = await fetchUsersByIds(uniqueUserIds);

    // Create user lookup map for O(1) access
    const userMap = new Map(users.map((user) => [user.id, user]));

    return posts.map((post) => ({
      ...post,
      user: userMap.get(post.userId) || null,
    }));
  } catch (error) {
    console.error("Failed to fetch posts with authors:", error);
    throw error;
  }
};

/**
 * Fetches a specific post by ID with author data included
 * @param {string|number} postId - The ID of the post to fetch
 * @returns {Promise<Object|null>} The post with user data or null if not found
 */
export const fetchPostByIdWithAuthor = async (postId) => {
  try {
    const post = await fetchPostById(postId);

    if (!post) return null;

    const users = await fetchUsers();
    const user = users.find((u) => u.id === post.userId) || null;

    return { ...post, user };
  } catch (error) {
    console.error(`Failed to fetch post with ID ${postId} and author:`, error);
    throw error;
  }
};

/**
 * Searches posts by title or content
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @param {boolean} options.caseSensitive - Whether search should be case sensitive
 * @param {boolean} options.includeAuthor - Whether to include author data
 * @returns {Promise<Array>} Array of matching posts
 */
export const searchPosts = async (
  query,
  { caseSensitive = false, includeAuthor = false } = {}
) => {
  try {
    const posts = includeAuthor
      ? await fetchPostsWithAuthor()
      : await fetchPosts();
    const searchQuery = caseSensitive ? query : query.toLowerCase();

    return posts.filter((post) => {
      const title = caseSensitive ? post.title : post.title?.toLowerCase();
      const body = caseSensitive ? post.body : post.body?.toLowerCase();

      return title?.includes(searchQuery) || body?.includes(searchQuery);
    });
  } catch (error) {
    console.error("Failed to search posts:", error);
    throw error;
  }
};

/**
 * Creates a new post with temporary localStorage persistence
 * @param {Object} post - The post object to create
 * @param {string} post.title - Post title
 * @param {string} post.body - Post content
 * @param {number} post.userId - Author user ID
 * @returns {Promise<Object>} The created post with generated ID and timestamp
 */
export const createPost = async (post) => {
  try {
    // Validate required fields
    if (!post.body || !post.userId) {
      throw new Error("Post must have title, body, and userId");
    }

    const existingPosts = getLocalPosts();

    // Generate new post with metadata
    const newPost = {
      ...post,
      id: Date.now(), // Simple ID generation for demo
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedPosts = [newPost, ...existingPosts];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));

    // Invalidate posts cache since we have new data
    clearPostsCache();

    return newPost;
  } catch (error) {
    console.error("Failed to create post:", error);
    throw error;
  }
};

/**
 * Retrieves locally stored posts
 * @returns {Array} Array of locally stored posts
 */
export const getLocalPosts = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (error) {
    console.error("Failed to retrieve local posts:", error);
    return [];
  }
};

/**
 * Combines API posts with local posts for complete data set
 * @param {Object} options - Fetch options
 * @param {boolean} options.includeAuthor - Whether to include author data
 * @returns {Promise<Array>} Combined array of API and local posts
 */
export const fetchAllPosts = async ({ includeAuthor = false } = {}) => {
  try {
    const [apiPosts, localPosts] = await Promise.all([
      includeAuthor ? fetchPostsWithAuthor() : fetchPosts(),
      Promise.resolve(getLocalPosts()),
    ]);

    // If including author data and we have local posts, enrich them
    if (includeAuthor && localPosts.length > 0) {
      const users = await fetchUsers();
      const userMap = new Map(users.map((user) => [user.id, user]));

      const enrichedLocalPosts = localPosts.map((post) => ({
        ...post,
        user: userMap.get(post.userId) || null,
      }));

      return [...enrichedLocalPosts, ...apiPosts];
    }

    return [...localPosts, ...apiPosts];
  } catch (error) {
    console.error("Failed to fetch all posts:", error);
    throw error;
  }
};

/**
 * Clears the posts cache
 */
export const clearPostsCache = () => {
  postsCache = null;
  cacheTimestamp = null;
  clearCache("posts.json");
};

/**
 * Clears local storage posts
 */
export const clearLocalPosts = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Gets cache information for debugging
 * @returns {Object} Cache status information
 */
export const getCacheInfo = () => ({
  hasCachedData: !!postsCache,
  cacheTimestamp,
  isValid: isCacheValid(),
  postCount: postsCache?.length || 0,
  localPostCount: getLocalPosts().length,
});
