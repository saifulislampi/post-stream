/**
 * Posts service - using Back4App with Parse SDK
 */

import Parse from 'parse';
import { APPLICATION_ID, JAVASCRIPT_KEY, SERVER_URL } from '../environments.js';

// Initialize Parse
Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
Parse.serverURL = SERVER_URL;

// Helper function to convert Parse object to plain object
const parseObjectToPlain = (parseObject) => {
  return {
    id: parseObject.id,
    userId: parseObject.get('userId'),
    body: parseObject.get('body'),
    tag: parseObject.get('tag'),
    imageName: parseObject.get('imageName'),
    createdAt: parseObject.get('createdAt'),
    updatedAt: parseObject.get('updatedAt')
  };
};

export const fetchPostsWithAuthor = async () => {
  try {
    // Query posts from Back4App
    const PostQuery = new Parse.Query('Post');
    PostQuery.descending('createdAt'); // Order by newest first
    const posts = await PostQuery.find();
    
    // Query users from Back4App
    const UserQuery = new Parse.Query('AppUser');
    const users = await UserQuery.find();
    
    // Convert Parse objects to plain objects
    const plainPosts = posts.map(parseObjectToPlain);
    const plainUsers = users.map(user => ({
      id: user.id,
      firstName: user.get('firstName'),
      lastName: user.get('lastName'),
      username: user.get('username'),
      email: user.get('email')
    }));
    
    // Combine posts with their authors
    const postsWithAuthors = plainPosts.map(post => {
      const user = plainUsers.find(u => u.id === post.userId);
      
      return {
        ...post,
        user: user || {
          id: post.userId,
          firstName: 'Unknown',
          lastName: 'User',
          email: 'unknown@example.com'
        }
      };
    });
    
    return postsWithAuthors;
  } catch (error) {
    console.error('Error fetching posts:', error);
    
    // Return fallback data if Back4App is not set up yet
    return [
      {
        id: 'fallback-1',
        userId: 'fallback-user-1',
        body: "Welcome to Post Stream! Please run 'npm run seed' to set up your Back4App database.",
        tag: 'general',
        imageName: null,
        user: {
          id: 'fallback-user-1',
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@example.com'
        }
      }
    ];
  }
};

export const createPost = async (postData) => {
  try {
    const Post = Parse.Object.extend('Post');
    const post = new Post();
    
    post.set('userId', postData.userId);
    post.set('body', postData.body);
    post.set('tag', postData.tag || 'general');
    post.set('imageName', postData.imageName || null);
    
    const savedPost = await post.save();
    
    // Return the saved post in the same format
    return {
      ...parseObjectToPlain(savedPost),
      user: postData.user
    };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};
