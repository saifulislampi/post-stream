/**
 * Comments service - using Back4App with Parse SDK
 */

import Parse from 'parse';
import { APPLICATION_ID, JAVASCRIPT_KEY, SERVER_URL } from '../environments.js';

// Initialize Parse (if not already initialized)
if (!Parse.applicationId) {
  Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
  Parse.serverURL = SERVER_URL;
}

// Helper function to convert Parse Comment object to plain object
const parseCommentToPlain = (parseComment) => {
  return {
    id: parseComment.id,
    postId: parseComment.get('postId'),
    userId: parseComment.get('userId'),
    body: parseComment.get('body'),
    createdAt: parseComment.get('createdAt'),
    updatedAt: parseComment.get('updatedAt')
  };
};

/**
 * Fetches comments for a specific post
 * @param {string|number} postId - The ID of the post
 * @returns {Promise<Array>} Array of comments for the post
 */
export const fetchCommentsByPost = async (postId) => {
  try {
    const CommentQuery = new Parse.Query('Comment');
    CommentQuery.equalTo('postId', postId.toString());
    CommentQuery.ascending('createdAt'); // Order by oldest first for comments
    const comments = await CommentQuery.find();
    return comments.map(parseCommentToPlain);
  } catch (error) {
    console.error('Error fetching comments:', error);
    // Return empty array instead of throwing to prevent UI from breaking
    return [];
  }
};

/**
 * Creates a new comment
 * @param {Object} commentData - The comment data
 * @returns {Promise<Object>} The created comment
 */
export const createComment = async (commentData) => {
  try {
    const Comment = Parse.Object.extend('Comment');
    const comment = new Comment();
    
    comment.set('postId', commentData.postId);
    comment.set('userId', commentData.userId);
    comment.set('body', commentData.body);
    
    const savedComment = await comment.save();
    return parseCommentToPlain(savedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};
