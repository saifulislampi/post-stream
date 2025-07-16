/**
 * Likes service - using Back4App with Parse SDK
 */

import Parse from "parse";
import { APPLICATION_ID, JAVASCRIPT_KEY, SERVER_URL } from "../environments.js";

// Initialize Parse
if (!Parse.applicationId) {
  Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
  Parse.serverURL = SERVER_URL;
}

// Helper function to convert Parse Like object to plain object
const parseLikeToPlain = (parseLike) => {
  return {
    id: parseLike.id,
    postId: parseLike.get("postId"),
    userId: parseLike.get("userId"),
    username: parseLike.get("username"),
    createdAt: parseLike.get("createdAt"),
    updatedAt: parseLike.get("updatedAt"),
  };
};

/**
 * Find a like relationship Parse.Object between a user and a post
 */
export const findLikeObj = async (userId, postId) => {
  const Like = Parse.Object.extend("Like");
  const query = new Parse.Query(Like);
  query.equalTo("userId", userId);
  query.equalTo("postId", postId);
  return await query.first();
};

/**
 * Check if a user has liked a post
 */
export const isPostLiked = async (userId, postId) => {
  try {
    const like = await findLikeObj(userId, postId);
    return !!like; // Returns true if like exists, false otherwise
  } catch (error) {
    console.error("Error checking if post is liked:", error);
    return false;
  }
};

/**
 * Like a post
 */
export const likePost = async (userId, username, postId) => {
  try {
    // Check if already liked
    const existingLike = await findLikeObj(userId, postId);
    if (existingLike) {
      return parseLikeToPlain(existingLike);
    }

    // Create new like
    const Like = Parse.Object.extend("Like");
    const like = new Like();
    like.set("userId", userId);
    like.set("username", username);
    like.set("postId", postId);

    const savedLike = await like.save();

    // Increment post's like count
    const Post = Parse.Object.extend("Post");
    const post = await new Parse.Query(Post).get(postId);
    post.increment("likesCount");
    await post.save();

    return parseLikeToPlain(savedLike);
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

/**
 * Unlike a post
 */
export const unlikePost = async (userId, postId) => {
  try {
    const like = await findLikeObj(userId, postId);
    if (!like) {
      return; // Already not liked
    }

    await like.destroy();

    // Decrement post's like count
    const Post = Parse.Object.extend("Post");
    const post = await new Parse.Query(Post).get(postId);
    post.increment("likesCount", -1);
    await post.save();
  } catch (error) {
    console.error("Error unliking post:", error);
    throw error;
  }
};

/**
 * Get likes for a post
 */
export const getPostLikes = async (postId, limit = 20, skip = 0) => {
  try {
    const Like = Parse.Object.extend("Like");
    const query = new Parse.Query(Like);
    query.equalTo("postId", postId);
    query.limit(limit);
    query.skip(skip);
    query.descending("createdAt");

    const likes = await query.find();
    return likes.map(parseLikeToPlain);
  } catch (error) {
    console.error("Error getting post likes:", error);
    return [];
  }
};

/**
 * Get posts liked by a user
 */
export const getUserLikedPosts = async (userId, limit = 20, skip = 0) => {
  try {
    const Like = Parse.Object.extend("Like");
    const query = new Parse.Query(Like);
    query.equalTo("userId", userId);
    query.limit(limit);
    query.skip(skip);
    query.descending("createdAt");

    const likes = await query.find();
    return likes.map(parseLikeToPlain);
  } catch (error) {
    console.error("Error getting user liked posts:", error);
    return [];
  }
};
