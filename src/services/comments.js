/**
 * Comments service - handles comment data operations
 */
import { get } from "./http.js";

/**
 * Fetches all comments from the API
 * @returns {Promise<Array>} Array of all comments
 */
export const fetchComments = () => get("data/comments.json");

/**
 * Fetches comments for a specific post
 * @param {string|number} postId - The ID of the post
 * @returns {Promise<Array>} Array of comments for the post
 */
export const fetchCommentsByPost = async (postId) => {
  try {
    const allComments = await fetchComments();
    return allComments.filter((comment) => comment.postId === Number(postId));
  } catch (error) {
    console.error(`Failed to fetch comments for post ${postId}:`, error);
    throw error;
  }
};

/**
 * Fetches a specific comment by ID
 * @param {string|number} commentId - The ID of the comment
 * @returns {Promise<Object|null>} The comment object or null if not found
 */
export const fetchCommentById = async (commentId) => {
  try {
    const allComments = await fetchComments();
    return (
      allComments.find((comment) => comment.id === Number(commentId)) || null
    );
  } catch (error) {
    console.error(`Failed to fetch comment with ID ${commentId}:`, error);
    throw error;
  }
};

/**
 * Groups comments by post ID for efficient lookup
 * @returns {Promise<Object>} Object with postId as keys and comment arrays as values
 */
export const fetchCommentsGroupedByPost = async () => {
  try {
    const allComments = await fetchComments();

    return allComments.reduce((grouped, comment) => {
      const postId = comment.postId;
      if (!grouped[postId]) {
        grouped[postId] = [];
      }
      grouped[postId].push(comment);
      return grouped;
    }, {});
  } catch (error) {
    console.error("Failed to fetch and group comments:", error);
    throw error;
  }
};
