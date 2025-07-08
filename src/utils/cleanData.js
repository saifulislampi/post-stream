/**
 * Clean script to remove all data from Back4App before seeding
 * Run this to clear your database
 */

const Parse = require("parse/node");

// Back4App configuration
const APPLICATION_ID = "3gMH4Kq9ALoTgvRaYN0STLZPBRBrw6HzlIqytZzf";
const JAVASCRIPT_KEY = "V1OcAlaeBrZwruPBmMjT2d0nIZ1r5rSI7ONSSPKN";
const SERVER_URL = "https://parseapi.back4app.com/";

// Initialize Parse
Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
Parse.serverURL = SERVER_URL;

async function cleanDatabase() {
  try {
    console.log("Starting database cleanup...");

    // Clean Comments
    const CommentQuery = new Parse.Query("Comment");
    const comments = await CommentQuery.find();
    if (comments.length > 0) {
      await Parse.Object.destroyAll(comments);
      console.log(`Deleted ${comments.length} comments`);
    }

    // Clean Posts
    const PostQuery = new Parse.Query("Post");
    const posts = await PostQuery.find();
    if (posts.length > 0) {
      await Parse.Object.destroyAll(posts);
      console.log(`Deleted ${posts.length} posts`);
    }

    // Clean Follows
    const FollowQuery = new Parse.Query("Follow");
    const follows = await FollowQuery.find();
    if (follows.length > 0) {
      await Parse.Object.destroyAll(follows);
      console.log(`Deleted ${follows.length} follow relationships`);
    }

    // Note: Parse.User deletion requires special permissions
    // Users should be manually deleted from Back4App dashboard if needed
    console.log("Note: Users need to be manually deleted from Back4App dashboard due to auth restrictions");

    console.log("Database cleanup completed successfully!");
  } catch (error) {
    console.error("Error cleaning database:", error);
  }
}

// Run the cleanup
cleanDatabase();
