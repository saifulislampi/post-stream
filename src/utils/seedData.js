/**
 * Seed script to populate Back4App with initial data
 * Run this once to set up your database with test data
 */

const Parse = require('parse/node');

// Back4App configuration
const APPLICATION_ID = "3gMH4Kq9ALoTgvRaYN0STLZPBRBrw6HzlIqytZzf";
const JAVASCRIPT_KEY = "V1OcAlaeBrZwruPBmMjT2d0nIZ1r5rSI7ONSSPKN";
const SERVER_URL = "https://parseapi.back4app.com/";

// Initialize Parse
Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
Parse.serverURL = SERVER_URL;

const INITIAL_USERS = [
  { firstName: "Jane", lastName: "Doe", email: "jane@example.com" },
  { firstName: "John", lastName: "Mayer", email: "john@example.com" },
  { firstName: "Ada", lastName: "Lovelace", email: "ada@example.com" }
];

const INITIAL_POSTS = [
  { userId: null, body: "Excited to launch Postive – a tiny micro-blog built in six weeks!", tag: "general", imageName: null },
  { userId: null, body: "Coffee ☕ + code = perfect combo.", tag: "life", imageName: null },
  { userId: null, body: "Fun fact: a day on Venus is longer than its year.", tag: "fun", imageName: null }
];

const INITIAL_COMMENTS = [
  { postId: null, userId: null, body: "Congrats on the launch! 🎉" },
  { postId: null, userId: null, body: "Can't wait to try it out." },
  { postId: null, userId: null, body: "Agreed – fuel of champions." },
  { postId: null, userId: null, body: "Coffee is life! ☕" },
  { postId: null, userId: null, body: "Space facts are always fascinating!" }
];

async function seedUsers() {
  console.log('Seeding users...');
  const createdUsers = [];
  
  for (const userData of INITIAL_USERS) {
    try {
      const AppUser = Parse.Object.extend('AppUser');
      const user = new AppUser();
      
      user.set('firstName', userData.firstName);
      user.set('lastName', userData.lastName);
      user.set('email', userData.email);
      
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`Created user: ${userData.firstName} ${userData.lastName} (ID: ${savedUser.id})`);
    } catch (error) {
      console.error(`Error creating user ${userData.firstName}:`, error.message);
    }
  }
  
  return createdUsers;
}

async function seedPosts(users) {
  console.log('Seeding posts...');
  const createdPosts = [];
  
  for (let i = 0; i < INITIAL_POSTS.length; i++) {
    const postData = INITIAL_POSTS[i];
    try {
      const Post = Parse.Object.extend('Post');
      const post = new Post();
      
      post.set('userId', users[i] ? users[i].id : users[0].id);
      post.set('body', postData.body);
      post.set('tag', postData.tag);
      post.set('imageName', postData.imageName);
      
      const savedPost = await post.save();
      createdPosts.push(savedPost);
      console.log(`Created post: ${postData.body.substring(0, 50)}... (ID: ${savedPost.id})`);
    } catch (error) {
      console.error(`Error creating post:`, error.message);
    }
  }
  
  return createdPosts;
}

async function seedComments(posts, users) {
  console.log('Seeding comments...');
  
  const commentMapping = [
    { postIndex: 0, userIndex: 1, body: "Congrats on the launch! 🎉" },
    { postIndex: 0, userIndex: 2, body: "Can't wait to try it out." },
    { postIndex: 1, userIndex: 0, body: "Agreed – fuel of champions." },
    { postIndex: 1, userIndex: 2, body: "Coffee is life! ☕" },
    { postIndex: 2, userIndex: 1, body: "Space facts are always fascinating!" }
  ];
  
  for (const commentData of commentMapping) {
    try {
      const Comment = Parse.Object.extend('Comment');
      const comment = new Comment();
      
      comment.set('postId', posts[commentData.postIndex].id);
      comment.set('userId', users[commentData.userIndex].id);
      comment.set('body', commentData.body);
      
      await comment.save();
      console.log(`Created comment: ${commentData.body}`);
    } catch (error) {
      console.error(`Error creating comment:`, error.message);
    }
  }
}

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    const users = await seedUsers();
    const posts = await seedPosts(users);
    await seedComments(posts, users);
    
    console.log('Database seeding completed successfully!');
    console.log(`Created ${users.length} users, ${posts.length} posts, and ${INITIAL_COMMENTS.length} comments`);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seeding
seedDatabase();
