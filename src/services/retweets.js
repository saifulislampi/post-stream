/**
 * Retweets service - using Back4App with Parse SDK
 */

import Parse from "parse";
import { APPLICATION_ID, JAVASCRIPT_KEY, SERVER_URL } from "../environments.js";

// Initialize Parse
if (!Parse.applicationId) {
  Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
  Parse.serverURL = SERVER_URL;
}

// Helper function to convert Parse Retweet object to plain object
const parseRetweetToPlain = (parseRetweet) => {
  return {
    id: parseRetweet.id,
    postId: parseRetweet.get("postId"),
    userId: parseRetweet.get("userId"),
    username: parseRetweet.get("username"),
    createdAt: parseRetweet.get("createdAt"),
    updatedAt: parseRetweet.get("updatedAt"),
  };
};

/**
 * Find a retweet relationship Parse.Object between a user and a post
 */
export const findRetweetObj = async (userId, postId) => {
  try {
    const Retweet = Parse.Object.extend("Retweet");
    const query = new Parse.Query(Retweet);
    query.equalTo("userId", userId);
    query.equalTo("postId", postId);
    
    return await query.first();
  } catch (error) {
    console.error("Error in findRetweetObj:", error);
    return null;
  }
};

/**
 * Check if a user has retweeted a post
 */
export const isPostRetweeted = async (userId, postId) => {
  try {
    const retweet = await findRetweetObj(userId, postId);
    return !!retweet; // Returns true if retweet exists, false otherwise
  } catch (error) {
    console.error("Error checking if post is retweeted:", error);
    return false;
  }
};

/**
 * Retweet a post
 */
export const retweetPost = async (userId, username, postId) => {
  try {
    // Check if already retweeted
    const existingRetweet = await findRetweetObj(userId, postId);
    if (existingRetweet) {
      return parseRetweetToPlain(existingRetweet);
    }

    // Get the original post
    const Post = Parse.Object.extend("Post");
    const originalPost = await new Parse.Query(Post).get(postId);

    // Create retweet tracking record
    const Retweet = Parse.Object.extend("Retweet");
    const retweet = new Retweet();
    retweet.set("userId", userId);
    retweet.set("username", username);
    retweet.set("postId", postId);

    const savedRetweet = await retweet.save();

    // Create a new post entry for the retweet
    const retweetPost = new Post();
    retweetPost.set("authorId", userId); // Set to the person who is retweeting
    retweetPost.set("authorUsername", username); // Set to the retweeter's username
    retweetPost.set("body", originalPost.get("body"));
    retweetPost.set("tag", originalPost.get("tag"));
    retweetPost.set("commentsCount", originalPost.get("commentsCount") ?? 0);
    retweetPost.set("likesCount", originalPost.get("likesCount") ?? 0);
    retweetPost.set("retweetsCount", originalPost.get("retweetsCount") ?? 0);
    retweetPost.set("image", originalPost.get("image"));
    retweetPost.set("imageUrl", originalPost.get("imageUrl"));
    
    // Retweet specific fields
    retweetPost.set("isRetweet", true);
    retweetPost.set("originalPostId", postId);
    retweetPost.set("originalPost", originalPost);
    retweetPost.set("retweetedBy", userId);
    retweetPost.set("retweetedByUsername", username);

    await retweetPost.save();

    // Increment original post's retweet count
    originalPost.increment("retweetsCount");
    await originalPost.save();

    return parseRetweetToPlain(savedRetweet);
  } catch (error) {
    console.error("Error retweeting post:", error);
    throw error;
  }
};

/**
 * Unretweet a post
 */
export const unretweetPost = async (userId, postId) => {
  try {
    const retweet = await findRetweetObj(userId, postId);
    if (!retweet) {
      return; // Already not retweeted
    }

    // Find and delete the retweet post
    const Post = Parse.Object.extend("Post");
    const retweetPostQuery = new Parse.Query(Post);
    retweetPostQuery.equalTo("isRetweet", true);
    retweetPostQuery.equalTo("originalPostId", postId);
    retweetPostQuery.equalTo("authorId", userId); // Changed from retweetedBy to authorId
    
    const retweetPost = await retweetPostQuery.first();
    if (retweetPost) {
      await retweetPost.destroy();
    }

    // Delete the retweet tracking record
    await retweet.destroy();

    // Decrement original post's retweet count
    const originalPost = await new Parse.Query(Post).get(postId);
    originalPost.increment("retweetsCount", -1);
    await originalPost.save();
  } catch (error) {
    console.error("Error unretweeting post:", error);
    throw error;
  }
};

/**
 * Get retweets for a post
 */
export const getPostRetweets = async (postId, limit = 20, skip = 0) => {
  try {
    const Retweet = Parse.Object.extend("Retweet");
    const query = new Parse.Query(Retweet);
    query.equalTo("postId", postId);
    query.limit(limit);
    query.skip(skip);
    query.descending("createdAt");

    const retweets = await query.find();
    return retweets.map(parseRetweetToPlain);
  } catch (error) {
    console.error("Error getting post retweets:", error);
    return [];
  }
};

/**
 * Get posts retweeted by a user
 */
export const getUserRetweetedPosts = async (userId, limit = 20, skip = 0) => {
  try {
    const Retweet = Parse.Object.extend("Retweet");
    const query = new Parse.Query(Retweet);
    query.equalTo("userId", userId);
    query.limit(limit);
    query.skip(skip);
    query.descending("createdAt");

    const retweets = await query.find();
    return retweets.map(parseRetweetToPlain);
  } catch (error) {
    console.error("Error getting user retweeted posts:", error);
    return [];
  }
};
