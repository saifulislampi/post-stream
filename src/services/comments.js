/**
 * Comments service - using Back4App with Parse SDK
 */

import Parse from "parse";
import { APPLICATION_ID, JAVASCRIPT_KEY, SERVER_URL } from "../environments.js";

// Initialize Parse
if (!Parse.applicationId) {
  Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
  Parse.serverURL = SERVER_URL;
}

// Helper function to convert Parse Comment object to plain object
const parseCommentToPlain = (parseComment) => {
  return {
    id: parseComment.id,
    postId: parseComment.get("postId"),
    authorId: parseComment.get("authorId"),
    authorUsername: parseComment.get("authorUsername"),
    body: parseComment.get("body"),
    createdAt: parseComment.get("createdAt"),
    updatedAt: parseComment.get("updatedAt"),
  };
};

/**
 * Fetch comments for a post
 */
export const fetchCommentsByPost = async (postId, limit = 50, skip = 0) => {
  try {
    const Comment = Parse.Object.extend("Comment");
    const query = new Parse.Query(Comment);
    query.equalTo("postId", postId);
    query.limit(limit);
    query.skip(skip);
    query.ascending("createdAt"); // Show oldest first for comments

    const comments = await query.find();
    return comments.map(parseCommentToPlain);
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    return [];
  }
};

/**
 * Create a new comment
 */
export const createComment = async (commentData, profile, post) => {
  try {
    const Comment = Parse.Object.extend("Comment");
    const comment = new Comment();

    comment.set("postId", post.id);
    comment.set("authorId", profile.id);
    
    // Handle both Parse objects and plain objects
    const username = typeof profile.get === 'function' 
      ? profile.get("username") 
      : profile.username || "Unknown";
    
    comment.set("authorUsername", username);
    comment.set("body", commentData.body);

    const savedComment = await comment.save();

    // Increment post's comment count
    post.increment("commentsCount");
    await post.save();

    return parseCommentToPlain(savedComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

/**
 * Fetch comments with author data
 */
export const fetchCommentsWithAuthor = async (postId, limit = 50, skip = 0) => {
  try {
    const comments = await fetchCommentsByPost(postId, limit, skip);

    // Get unique author IDs
    const authorIds = [...new Set(comments.map((comment) => comment.authorId))];

    // Import profile service to avoid circular dependencies
    const { fetchProfilesByIds } = await import("./profiles.js");

    // Fetch author profiles
    const profiles = await fetchProfilesByIds(authorIds);

    // Create a lookup map for O(1) access
    const profileMap = new Map(
      profiles.map((profile) => [profile.id, profile])
    );

    // Attach author data to comments
    return comments.map((comment) => ({
      ...comment,
      author: profileMap.get(comment.authorId) || null,
    }));
  } catch (error) {
    console.error(
      `Error fetching comments with author for post ${postId}:`,
      error
    );
    return [];
  }
};
