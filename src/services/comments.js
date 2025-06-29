/**
 * Comments service - simple, with embedded data
 */

const COMMENTS = [
  { id: 1, postId: 100, userId: 2, body: "Congrats on the launch! 🎉" },
  { id: 2, postId: 100, userId: 3, body: "Can't wait to try it out." },
  { id: 3, postId: 101, userId: 1, body: "Agreed – fuel of champions." },
  { id: 4, postId: 101, userId: 3, body: "Coffee is life! ☕" },
  { id: 5, postId: 102, userId: 2, body: "Space facts are always fascinating!" }
];

/**
 * Fetches comments for a specific post
 * @param {string|number} postId - The ID of the post
 * @returns {Promise<Array>} Array of comments for the post
 */
export const fetchCommentsByPost = async (postId) =>
  COMMENTS.filter((c) => c.postId === Number(postId));
