/**
 * Seed script to populate Back4App with initial data
 * Run this once to set up your database with test data
 */

const Parse = require("parse/node");

// Back4App configuration
const APPLICATION_ID = "3gMH4Kq9ALoTgvRaYN0STLZPBRBrw6HzlIqytZzf";
const JAVASCRIPT_KEY = "V1OcAlaeBrZwruPBmMjT2d0nIZ1r5rSI7ONSSPKN";
const SERVER_URL = "https://parseapi.back4app.com/";

// Initialize Parse
Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
Parse.serverURL = SERVER_URL;

const INITIAL_USERS = [
  {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    username: "janedoe",
    password: "password123", // Added password for authentication
  },
  {
    firstName: "John",
    lastName: "Mayer",
    email: "john@example.com",
    username: "johnmayer",
    password: "password123", // Added password for authentication
  },
  {
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    username: "adalovelace",
    password: "password123", // Added password for authentication
  },
];

const INITIAL_POSTS = [
  {
    username: "janedoe", // Reference user by username instead of userId
    body: "Excited to launch Postive – a tiny micro-blog built in six weeks!",
    tag: "general",
    imageName: null,
  },
  {
    username: "johnmayer", // Reference user by username instead of userId
    body: "Coffee ☕ + code = perfect combo.",
    tag: "life",
    imageName: null,
  },
  {
    username: "adalovelace", // Reference user by username instead of userId
    body: "Fun fact: a day on Venus is longer than its year.",
    tag: "fun",
    imageName: null,
  },
];

// New follow relationships
const INITIAL_FOLLOWS = [
  { followerIndex: 0, followingIndex: 1 }, // Jane follows John
  { followerIndex: 0, followingIndex: 2 }, // Jane follows Ada
  { followerIndex: 1, followingIndex: 2 }, // John follows Ada
  { followerIndex: 2, followingIndex: 0 }  // Ada follows Jane
];

const INITIAL_COMMENTS = [
  { postId: null, userId: null, body: "Congrats on the launch! 🎉" },
  { postId: null, userId: null, body: "Can't wait to try it out." },
  { postId: null, userId: null, body: "Agreed – fuel of champions." },
  { postId: null, userId: null, body: "Coffee is life! ☕" },
  { postId: null, userId: null, body: "Space facts are always fascinating!" },
];

async function seedUsers() {
  console.log('Seeding users...');
  const createdUsers = [];
  
  for (const userData of INITIAL_USERS) {
    try {
      // Always try to find existing user first
      const UserQuery = new Parse.Query(Parse.User);
      UserQuery.equalTo('username', userData.username);
      let user = await UserQuery.first();
      
      if (user) {
        console.log(`User @${userData.username} already exists, using existing user`);
        createdUsers.push(user);
      } else {
        // If user doesn't exist, create new one
        user = new Parse.User();
        user.setUsername(userData.username);
        user.setPassword(userData.password);
        user.setEmail(userData.email);
        user.set('firstName', userData.firstName);
        user.set('lastName', userData.lastName);
        user.set('followersCount', 0);
        user.set('followingCount', 0);
        
        const savedUser = await user.signUp();
        createdUsers.push(savedUser);
        console.log(`Created user: ${userData.firstName} ${userData.lastName} (@${userData.username})`);
      }
    } catch (error) {
      console.error(`Error with user ${userData.username}:`, error.message);
    }
  }
  
  console.log(`Found/created ${createdUsers.length} users`);
  return createdUsers;
}


async function seedPosts(users) {
  console.log("Seeding posts...");
  const createdPosts = [];

  for (let i = 0; i < INITIAL_POSTS.length; i++) {
    const postData = INITIAL_POSTS[i];
    try {
      const Post = Parse.Object.extend("Post");
      const post = new Post();

      // Find user by username instead of using index
      const user = users.find(u => u.get('username') === postData.username);
      if (!user) {
        console.error(`User with username ${postData.username} not found`);
        continue;
      }

      post.set("userId", user.id);
      post.set("username", postData.username); // Also store username for easier queries
      post.set("body", postData.body);
      post.set("tag", postData.tag);
      post.set("imageName", postData.imageName);

      const savedPost = await post.save();
      createdPosts.push(savedPost);
      console.log(
        `Created post by @${postData.username}: ${postData.body.substring(0, 50)}... (ID: ${
          savedPost.id
        })`
      );
    } catch (error) {
      console.error(`Error creating post:`, error.message);
    }
  }

  return createdPosts;
}

async function seedComments(posts, users) {
  console.log("Seeding comments...");

  const commentMapping = [
    { postIndex: 0, userIndex: 1, body: "Congrats on the launch! 🎉" },
    { postIndex: 0, userIndex: 2, body: "Can't wait to try it out." },
    { postIndex: 1, userIndex: 0, body: "Agreed – fuel of champions." },
    { postIndex: 1, userIndex: 2, body: "Coffee is life! ☕" },
    { postIndex: 2, userIndex: 1, body: "Space facts are always fascinating!" },
  ];

  for (const commentData of commentMapping) {
    try {
      const Comment = Parse.Object.extend("Comment");
      const comment = new Comment();

      comment.set("postId", posts[commentData.postIndex].id);
      comment.set("userId", users[commentData.userIndex].id);
      comment.set("body", commentData.body);

      await comment.save();
      console.log(`Created comment: ${commentData.body}`);
    } catch (error) {
      console.error(`Error creating comment:`, error.message);
    }
  }
}

// Add new function to create follow relationships
async function seedFollows(users) {
  console.log('Seeding follow relationships...');
  
  for (const followData of INITIAL_FOLLOWS) {
    try {
      const Follow = Parse.Object.extend('Follow');
      const follow = new Follow();
      
      follow.set('followerId', users[followData.followerIndex].id);
      follow.set('followingId', users[followData.followingIndex].id);
      
      await follow.save();
      
      // Update follower counts
      const follower = users[followData.followerIndex];
      const following = users[followData.followingIndex];
      
      follower.increment('followingCount');
      following.increment('followersCount');
      
      await follower.save();
      await following.save();
      
      console.log(`@${follower.get('username')} follows @${following.get('username')}`);
    } catch (error) {
      console.error('Error creating follow relationship:', error.message);
    }
  }
}

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    const users = await seedUsers();
    const posts = await seedPosts(users);
    await seedFollows(users);
    await seedComments(posts, users);

    console.log("Database seeding completed successfully!");
    console.log(
      `Created ${users.length} users, ${posts.length} posts, and ${INITIAL_COMMENTS.length} comments`
    );
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run the seeding
seedDatabase();
