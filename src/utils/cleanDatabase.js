/**
 * Clean up Back4App database
 */

const Parse = require('parse/node');

// Back4App configuration
const APPLICATION_ID = "3gMH4Kq9ALoTgvRaYN0STLZPBRBrw6HzlIqytZzf";
const JAVASCRIPT_KEY = "V1OcAlaeBrZwruPBmMjT2d0nIZ1r5rSI7ONSSPKN";
const SERVER_URL = "https://parseapi.back4app.com/";

// Initialize Parse
Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
Parse.serverURL = SERVER_URL;

async function cleanupDatabase() {
  try {
    console.log('Starting database cleanup...');
    
    // Clean up all existing data
    console.log('Cleaning up AppUsers...');
    const UserQuery = new Parse.Query('AppUser');
    const users = await UserQuery.find();
    if (users.length > 0) {
      await Parse.Object.destroyAll(users);
      console.log(`Deleted ${users.length} users`);
    }
    
    console.log('Cleaning up Posts...');
    const PostQuery = new Parse.Query('Post');
    const posts = await PostQuery.find();
    if (posts.length > 0) {
      await Parse.Object.destroyAll(posts);
      console.log(`Deleted ${posts.length} posts`);
    }
    
    console.log('Cleaning up Comments...');
    const CommentQuery = new Parse.Query('Comment');
    const comments = await CommentQuery.find();
    if (comments.length > 0) {
      await Parse.Object.destroyAll(comments);
      console.log(`Deleted ${comments.length} comments`);
    }
    
    console.log('Database cleanup completed successfully!');
  } catch (error) {
    console.error('Error cleaning database:', error);
  }
}

// Run the cleanup
cleanupDatabase();
