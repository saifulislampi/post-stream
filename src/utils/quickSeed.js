const Parse = require("parse/node");

// Back4App configuration
const APPLICATION_ID = "3gMH4Kq9ALoTgvRaYN0STLZPBRBrw6HzlIqytZzf";
const JAVASCRIPT_KEY = "V1OcAlaeBrZwruPBmMjT2d0nIZ1r5rSI7ONSSPKN";
const SERVER_URL = "https://parseapi.back4app.com/";

// Initialize Parse
Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
Parse.serverURL = SERVER_URL;

async function seedWithExistingUsers() {
  try {
    console.log("Fetching existing users...");
    const UserQuery = new Parse.Query(Parse.User);
    const users = await UserQuery.find();
    
    console.log(`Found ${users.length} existing users:`);
    users.forEach(user => {
      console.log(`- ${user.get('firstName')} ${user.get('lastName')} (@${user.get('username')})`);
    });
    
    if (users.length === 0) {
      console.log("No users found. Please create some users first through the app.");
      return;
    }
    
    // Create some sample posts with existing users
    const samplePosts = [
      {
        body: "Excited to launch Post Stream – a tiny micro-blog built with React!",
        tag: "general",
      },
      {
        body: "Coffee ☕ + code = perfect combo.",
        tag: "life",
      },
      {
        body: "Fun fact: a day on Venus is longer than its year.",
        tag: "fun",
      },
    ];
    
    console.log("\nCreating posts...");
    for (let i = 0; i < samplePosts.length && i < users.length; i++) {
      const user = users[i];
      const postData = samplePosts[i];
      
      const Post = Parse.Object.extend("Post");
      const post = new Post();
      
      post.set("userId", user.id);
      post.set("username", user.get('username'));
      post.set("body", postData.body);
      post.set("tag", postData.tag);
      post.set("imageName", null);
      
      await post.save();
      console.log(`Created post by @${user.get('username')}: ${postData.body.substring(0, 50)}...`);
    }
    
    console.log("\nSample posts created successfully!");
    
  } catch (error) {
    console.error("Error:", error);
  }
}

seedWithExistingUsers();
