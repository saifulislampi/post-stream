/**
 * Posts service - using Back4App with Parse SDK
 */

import Parse from "parse";
import { APPLICATION_ID, JAVASCRIPT_KEY, SERVER_URL } from "../environments.js";

// Initialize Parse
if (!Parse.applicationId) {
  Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
  Parse.serverURL = SERVER_URL;
}

// Helper function to generate UUID-like string
const generateUUID = () => {
  // Use crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback UUID v4 generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
};

// Helper function to get file extension from filename
const getFileExtension = (filename) => {
  if (!filename || typeof filename !== 'string') {
    return '';
  }
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return '';
  }
  return filename.substring(lastDotIndex).toLowerCase();
};

// Helper function to convert Parse Post object to plain object
const parsePostToPlain = (p) => ({
  id: p.id,
  authorId: p.get("authorId"),
  authorUsername: p.get("authorUsername"),
  body: p.get("body"),
  tag: p.get("tag"),
  commentsCount: p.get("commentsCount") ?? 0,
  likesCount: p.get("likesCount") ?? 0,
  retweetsCount: p.get("retweetsCount") ?? 0,
  image: p.get("image"), // Parse File object for image
  imageUrl: p.get("image") ? p.get("image").url() : p.get("imageUrl"), // Direct URL for display (Parse File or hosted URL)
  
  // Retweet fields
  isRetweet: p.get("isRetweet") ?? false,
  originalPostId: p.get("originalPostId"),
  originalPost: p.get("originalPost") ? parsePostToPlain(p.get("originalPost")) : null,
  retweetedBy: p.get("retweetedBy"), // Who retweeted this post
  retweetedByUsername: p.get("retweetedByUsername"),

  // createdAt / updatedAt are native properties on Parse.Object.
  // Fallback to .get() so it still works if someone set them manually.
  createdAt: p.createdAt ?? p.get("createdAt"),
  updatedAt: p.updatedAt ?? p.get("updatedAt"),
});

/**
 * Fetch all posts with pagination
 */
export const fetchPosts = async (limit = 20, skip = 0) => {
  try {
    const Post = Parse.Object.extend("Post");
    const query = new Parse.Query(Post);
    query.descending("createdAt");
    query.limit(limit);
    query.skip(skip);
    
    // Include original post for retweets
    query.include("originalPost");

    const posts = await query.find();
    return posts.map(parsePostToPlain);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

/**
 * Fetch posts with author profile data
 */
export const fetchPostsWithAuthor = async (limit = 20, skip = 0) => {
  try {
    const posts = await fetchPosts(limit, skip);

    // Get unique author IDs (including original post authors for retweets and retweeter IDs)
    const authorIds = [...new Set(posts.map((post) => {
      if (post.isRetweet && post.originalPost) {
        return post.originalPost.authorId; // For displaying original author info
      }
      return post.authorId; // For regular posts and retweeter info
    }))];

    // Also get retweeter IDs for retweets
    const retweeterIds = [...new Set(posts.filter(post => post.isRetweet).map(post => post.authorId))];
    const allIds = [...new Set([...authorIds, ...retweeterIds])];

    // Import profile service to avoid circular dependencies
    const { fetchProfilesByIds } = await import("./profiles.js");

    // Fetch author profiles
    const profiles = await fetchProfilesByIds(allIds);

    // Create a lookup map for O(1) access
    const profileMap = new Map(
      profiles.map((profile) => [profile.id, profile])
    );

    // Attach author data to posts
    return posts.map((post) => {
      if (post.isRetweet && post.originalPost) {
        // For retweets, attach both the original post author's profile and the retweeter's profile
        return {
          ...post,
          author: profileMap.get(post.authorId) || null, // Retweeter's profile
          originalPost: {
            ...post.originalPost,
            author: profileMap.get(post.originalPost.authorId) || null, // Original author's profile
          }
        };
      } else {
        // For regular posts, attach the post author's profile
        return {
          ...post,
          author: profileMap.get(post.authorId) || null,
        };
      }
    });
  } catch (error) {
    console.error("Error fetching posts with author:", error);
    return [];
  }
};

/**
 * Fetch a post by ID
 */
export const fetchPostById = async (postId) => {
  try {
    const Post = Parse.Object.extend("Post");
    const query = new Parse.Query(Post);
    const post = await query.get(postId);
    return parsePostToPlain(post);
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error);
    return null;
  }
};

/**
 * Create a new post
 *
 * @param {Object}  postData              – { body, tag, … }
 * @param {Object|Parse.Object} profile   – author profile (plain or Parse)
 */
export const createPost = async (postData, profile) => {
  try {
    // --------------------------------------------------
    // 1. Normalise the profile
    // --------------------------------------------------
    const isParseObj = profile instanceof Parse.Object;
    const authorId = isParseObj ? profile.id : profile.id;
    const username = isParseObj ? profile.get("username") : profile.username;

    // If we need to increment postsCount later, we'll need the Parse object.
    // Load it only when necessary to avoid an extra query in normal cases.
    let profileObj = isParseObj ? profile : null;

    // --------------------------------------------------
    // 2. Handle image upload if present
    // --------------------------------------------------
    let imageFile = null;
    if (postData.image && postData.image instanceof File) {
      // Handle regular File object (from file input)
      // Generate a clean filename using timestamp + UUID
      const timestamp = Date.now();
      const uuid = generateUUID();
      const fileExtension = getFileExtension(postData.image.name);
      const fileName = `post_${timestamp}_${uuid}${fileExtension}`;
      
      imageFile = new Parse.File(fileName, postData.image);
      await imageFile.save();
    } else if (postData.imageUrl) {
      // Handle Bytescale hosted image URL
      // We'll store the URL directly since it's already hosted
      // No need to create a Parse.File for an already hosted image
    }

    // --------------------------------------------------
    // 3. Create and save the Post
    // --------------------------------------------------
    const Post = Parse.Object.extend("Post");
    const post = new Post();

    post.set("authorId", authorId);
    post.set("authorUsername", username);
    post.set("body", postData.body);
    post.set("tag", postData.tag || "general");
    post.set("commentsCount", 0);
    post.set("likesCount", 0);
    post.set("retweetsCount", 0);
    post.set("isRetweet", false);
    
    // Set image if uploaded
    if (imageFile) {
      post.set("image", imageFile);
    } else if (postData.imageUrl) {
      // Store the hosted image URL directly
      post.set("imageUrl", postData.imageUrl);
    }

    const savedPost = await post.save();

    // --------------------------------------------------
    // 4. Increment the author's postsCount
    // --------------------------------------------------
    if (!profileObj) {
      const Profile = Parse.Object.extend("Profile");
      profileObj = await new Parse.Query(Profile).get(authorId);
    }
    profileObj.increment("postsCount");
    await profileObj.save();

    return parsePostToPlain(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

/**
 * Fetch posts by a specific profile (including both authored posts and retweets)
 */
export const fetchPostsByProfile = async (profileId, limit = 20, skip = 0) => {
  try {
    const Post = Parse.Object.extend("Post");
    
    // Query for posts authored by this profile (including retweets)
    // Since retweets now have authorId set to the retweeter, this will get both
    const query = new Parse.Query(Post);
    query.equalTo("authorId", profileId);
    query.descending("createdAt");
    query.limit(limit);
    query.skip(skip);
    
    // Include original post for retweets
    query.include("originalPost");

    const posts = await query.find();
    return posts.map(parsePostToPlain);
  } catch (error) {
    console.error(`Error fetching posts for profile ${profileId}:`, error);
    return [];
  }
};

/**
 * Search posts
 */
export const searchPosts = async (searchTerm, limit = 20) => {
  try {
    const Post = Parse.Object.extend("Post");
    const query = new Parse.Query(Post);
    query.contains("body", searchTerm);
    query.limit(limit);
    query.descending("createdAt");

    const posts = await query.find();
    return posts.map(parsePostToPlain);
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
};

/**
 * Fetch posts by a specific profile with author data
 */
export const fetchPostsByProfileWithAuthor = async (profileId, limit = 20, skip = 0) => {
  try {
    const posts = await fetchPostsByProfile(profileId, limit, skip);

    // Get unique author IDs (including original post authors for retweets and retweeter IDs)
    const authorIds = [...new Set(posts.map((post) => {
      if (post.isRetweet && post.originalPost) {
        return post.originalPost.authorId; // For displaying original author info
      }
      return post.authorId; // For regular posts and retweeter info
    }))];

    // Also get retweeter IDs for retweets
    const retweeterIds = [...new Set(posts.filter(post => post.isRetweet).map(post => post.authorId))];
    const allIds = [...new Set([...authorIds, ...retweeterIds])];

    // Import profile service to avoid circular dependencies
    const { fetchProfilesByIds } = await import("./profiles.js");

    // Fetch author profiles
    const profiles = await fetchProfilesByIds(allIds);

    // Create a lookup map for O(1) access
    const profileMap = new Map(
      profiles.map((profile) => [profile.id, profile])
    );

    // Attach author data to posts
    return posts.map((post) => {
      if (post.isRetweet && post.originalPost) {
        // For retweets, attach both the original post author's profile and the retweeter's profile
        return {
          ...post,
          author: profileMap.get(post.authorId) || null, // Retweeter's profile
          originalPost: {
            ...post.originalPost,
            author: profileMap.get(post.originalPost.authorId) || null, // Original author's profile
          }
        };
      } else {
        // For regular posts, attach the post author's profile
        return {
          ...post,
          author: profileMap.get(post.authorId) || null,
        };
      }
    });
  } catch (error) {
    console.error(`Error fetching posts for profile ${profileId} with author:`, error);
    return [];
  }
};
