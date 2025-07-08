/**
 * Posts service - using Back4App with Parse SDK
 */

import Parse from 'parse';
import { APPLICATION_ID, JAVASCRIPT_KEY, SERVER_URL } from '../environments.js';

// Initialize Parse
if (!Parse.applicationId) {
  Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
  Parse.serverURL = SERVER_URL;
}

// Helper function to convert Parse Post object to plain object
const parsePostToPlain = (parsePost) => {
  return {
    id: parsePost.id,
    authorId: parsePost.get('authorId'),
    authorUsername: parsePost.get('authorUsername'),
    body: parsePost.get('body'),
    tag: parsePost.get('tag'),
    commentsCount: parsePost.get('commentsCount') || 0,
    likesCount: parsePost.get('likesCount') || 0,
    createdAt: parsePost.get('createdAt'),
    updatedAt: parsePost.get('updatedAt')
  };
};

/**
 * Fetch all posts with pagination
 */
export const fetchPosts = async (limit = 20, skip = 0) => {
  try {
    const Post = Parse.Object.extend('Post');
    const query = new Parse.Query(Post);
    query.descending('createdAt');
    query.limit(limit);
    query.skip(skip);
    
    const posts = await query.find();
    return posts.map(parsePostToPlain);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

/**
 * Fetch posts with author profile data
 */
export const fetchPostsWithAuthor = async (limit = 20, skip = 0) => {
  try {
    const posts = await fetchPosts(limit, skip);
    
    // Get unique author IDs
    const authorIds = [...new Set(posts.map(post => post.authorId))];
    
    // Import profile service to avoid circular dependencies
    const { fetchProfilesByIds } = await import('./profiles.js');
    
    // Fetch author profiles
    const profiles = await fetchProfilesByIds(authorIds);
    
    // Create a lookup map for O(1) access
    const profileMap = new Map(profiles.map(profile => [profile.id, profile]));
    
    // Attach author data to posts
    return posts.map(post => ({
      ...post,
      author: profileMap.get(post.authorId) || null
    }));
  } catch (error) {
    console.error('Error fetching posts with author:', error);
    return [];
  }
};

/**
 * Fetch a post by ID
 */
export const fetchPostById = async (postId) => {
  try {
    const Post = Parse.Object.extend('Post');
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
 */
export const createPost = async (postData, profile) => {
  try {
    const Post = Parse.Object.extend('Post');
    const post = new Post();
    
    post.set('authorId', profile.id);
    post.set('authorUsername', profile.get('username'));
    post.set('body', postData.body);
    post.set('tag', postData.tag || 'general');
    post.set('commentsCount', 0);
    post.set('likesCount', 0);
    
    const savedPost = await post.save();
    
    // Increment author's post count
    profile.increment('postsCount');
    await profile.save();
    
    return parsePostToPlain(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

/**
 * Fetch posts by a specific profile
 */
export const fetchPostsByProfile = async (profileId, limit = 20, skip = 0) => {
  try {
    const Post = Parse.Object.extend('Post');
    const query = new Parse.Query(Post);
    query.equalTo('authorId', profileId);
    query.descending('createdAt');
    query.limit(limit);
    query.skip(skip);
    
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
    const Post = Parse.Object.extend('Post');
    const query = new Parse.Query(Post);
    query.contains('body', searchTerm);
    query.limit(limit);
    query.descending('createdAt');
    
    const posts = await query.find();
    return posts.map(parsePostToPlain);
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
};
