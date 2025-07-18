/**
 * Seed script for Parse/Back4App with User and Profile architecture
 */
const Parse = require("parse/node");

// Back4App configuration
const APPLICATION_ID = "3gMH4Kq9ALoTgvRaYN0STLZPBRBrw6HzlIqytZzf";
const JAVASCRIPT_KEY = "V1OcAlaeBrZwruPBmMjT2d0nIZ1r5rSI7ONSSPKN";
const MASTER_KEY = "neaO4TBGd5NKjtuDRjEt7Sqazr32LmyLYp06A9Wg";
const SERVER_URL = "https://parseapi.back4app.com/";

// Initialize Parse with master key for seeding
Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY, MASTER_KEY);
Parse.serverURL = SERVER_URL;
Parse.masterKey = MASTER_KEY;

const INITIAL_USERS = [
  {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    username: "janedoe",
    bio: "Software engineer passionate about clean code and coffee ☕",
    password: "password123", // In production, use secure passwords
  },
  {
    firstName: "John",
    lastName: "Mayer",
    email: "john@example.com",
    username: "johnmayer",
    bio: "Music lover, code writer, and space enthusiast 🚀",
    password: "password123",
  },
  {
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    username: "adalovelace",
    bio: "First programmer. Breaking barriers since 1843.",
    password: "password123",
  },
];

const INITIAL_POSTS = [
  {
    authorIndex: 0, // Jane
    body: "Excited to launch Post Stream – a Twitter clone built with React and Parse!",
    tag: "general",
  },
  {
    authorIndex: 1, // John
    body: "Coffee ☕ + code = perfect combo for building amazing apps.",
    tag: "life",
  },
  {
    authorIndex: 2, // Ada
    body: "Fun fact: a day on Venus is longer than its year. Space is fascinating! 🌌",
    tag: "science",
  },
  {
    authorIndex: 0, // Jane
    body: "Learning React and Parse integration. The possibilities are endless! 🚀",
    tag: "coding",
  },
  {
    authorIndex: 2, // Ada
    body: "Just pushed my latest algorithm to GitHub. Mathematics meets programming! 💻",
    tag: "coding",
  },
];

const INITIAL_FOLLOWS = [
  { followerIndex: 0, followingIndex: 1 }, // Jane follows John
  { followerIndex: 0, followingIndex: 2 }, // Jane follows Ada
  { followerIndex: 1, followingIndex: 2 }, // John follows Ada
  { followerIndex: 2, followingIndex: 0 }, // Ada follows Jane
];

const INITIAL_COMMENTS = [
  { postIndex: 0, authorIndex: 1, body: "Congrats on the launch! 🎉" },
  { postIndex: 0, authorIndex: 2, body: "Can't wait to try it out." },
  { postIndex: 1, authorIndex: 0, body: "Agreed – fuel of champions." },
  { postIndex: 1, authorIndex: 2, body: "Coffee is life! ☕" },
  { postIndex: 2, authorIndex: 1, body: "Space facts are always fascinating!" },
];

const INITIAL_LIKES = [
  { postIndex: 0, userIndex: 1 }, // John likes Jane's launch post
  { postIndex: 0, userIndex: 2 }, // Ada likes Jane's launch post
  { postIndex: 1, userIndex: 0 }, // Jane likes John's coffee post
  { postIndex: 1, userIndex: 2 }, // Ada likes John's coffee post
  { postIndex: 2, userIndex: 0 }, // Jane likes Ada's space fact
  { postIndex: 2, userIndex: 1 }, // John likes Ada's space fact
  { postIndex: 3, userIndex: 1 }, // John likes Jane's React post
  { postIndex: 4, userIndex: 0 }, // Jane likes Ada's algorithm post
  { postIndex: 4, userIndex: 1 }, // John likes Ada's algorithm post
];

const INITIAL_RETWEETS = [
  { postIndex: 2, userIndex: 1 }, // John retweets Ada's space fact
  { postIndex: 4, userIndex: 0 }, // Jane retweets Ada's algorithm post
  { postIndex: 0, userIndex: 2 }, // Ada retweets Jane's launch post
];

async function seedUsers() {
  console.log("📝 Seeding users and profiles...");
  const createdUsers = [];
  const createdProfiles = [];

  for (const userData of INITIAL_USERS) {
    try {
      // Create Parse.User for authentication
      const user = new Parse.User();
      user.setUsername(userData.username);
      user.setPassword(userData.password);
      user.setEmail(userData.email);

      const savedUser = await user.signUp(null, { useMasterKey: true });
      createdUsers.push(savedUser);

      // Create corresponding Profile
      const Profile = Parse.Object.extend("Profile");
      const profile = new Profile();

      profile.set("userId", savedUser.id);
      profile.set("username", userData.username);
      profile.set("firstName", userData.firstName);
      profile.set("lastName", userData.lastName);
      profile.set("bio", userData.bio);
      profile.set("email", userData.email);
      profile.set("followersCount", 0);
      profile.set("followingCount", 0);
      profile.set("postsCount", 0);

      // Set ACL: public read, user write
      // const acl = new Parse.ACL();
      // acl.setPublicReadAccess(true);
      // acl.setWriteAccess(savedUser, true);
      // profile.setACL(acl);

      const savedProfile = await profile.save(null, { useMasterKey: true });
      createdProfiles.push(savedProfile);

      console.log(`✓ Created user and profile: @${userData.username}`);
    } catch (error) {
      console.error(
        `✗ Error creating user ${userData.username}:`,
        error.message
      );
    }
  }

  return { users: createdUsers, profiles: createdProfiles };
}

async function seedPosts(profiles) {
  console.log("\n📮 Seeding posts...");
  const createdPosts = [];

  for (const postData of INITIAL_POSTS) {
    try {
      const Post = Parse.Object.extend("Post");
      const post = new Post();
      const profile = profiles[postData.authorIndex];

      post.set("authorId", profile.id);
      post.set("authorUsername", profile.get("username"));
      post.set("body", postData.body);
      post.set("tag", postData.tag);
      post.set("likesCount", 0);
      post.set("commentsCount", 0);
      post.set("retweetsCount", 0);
      post.set("isRetweet", false);
      post.set("originalPostId", null);
      post.set("retweetedBy", null);
      post.set("retweetedByUsername", null);

      const savedPost = await post.save(null, { useMasterKey: true });
      createdPosts.push(savedPost);

      // Increment author's post count
      profile.increment("postsCount");
      await profile.save(null, { useMasterKey: true });

      console.log(
        `✓ Created post by @${profile.get(
          "username"
        )}: "${postData.body.substring(0, 40)}..."`
      );
    } catch (error) {
      console.error(`✗ Error creating post:`, error.message);
    }
  }

  return createdPosts;
}

async function seedFollows(profiles) {
  console.log("\n👥 Seeding follow relationships...");

  for (const followData of INITIAL_FOLLOWS) {
    try {
      const Follow = Parse.Object.extend("Follow");
      const follow = new Follow();

      const followerProfile = profiles[followData.followerIndex];
      const followingProfile = profiles[followData.followingIndex];

      follow.set("followerId", followerProfile.id);
      follow.set("followingId", followingProfile.id);
      follow.set("followerUsername", followerProfile.get("username"));
      follow.set("followingUsername", followingProfile.get("username"));

      await follow.save(null, { useMasterKey: true });

      // Update counts
      followerProfile.increment("followingCount");
      followingProfile.increment("followersCount");

      await Parse.Object.saveAll([followerProfile, followingProfile], {
        useMasterKey: true,
      });

      console.log(
        `✓ @${followerProfile.get(
          "username"
        )} now follows @${followingProfile.get("username")}`
      );
    } catch (error) {
      console.error("✗ Error creating follow relationship:", error.message);
    }
  }
}

async function seedComments(posts, profiles) {
  console.log("\n💬 Seeding comments...");

  for (const commentData of INITIAL_COMMENTS) {
    try {
      const Comment = Parse.Object.extend("Comment");
      const comment = new Comment();
      const post = posts[commentData.postIndex];
      const profile = profiles[commentData.authorIndex];

      comment.set("postId", post.id);
      comment.set("authorId", profile.id);
      comment.set("authorUsername", profile.get("username"));
      comment.set("body", commentData.body);

      await comment.save(null, { useMasterKey: true });

      // Increment post's comment count
      post.increment("commentsCount");
      await post.save(null, { useMasterKey: true });

      console.log(
        `✓ @${profile.get("username")} commented: "${commentData.body}"`
      );
    } catch (error) {
      console.error(`✗ Error creating comment:`, error.message);
    }
  }
}

async function seedLikes(posts, users, profiles) {
  console.log("\n❤️ Seeding likes...");

  for (const likeData of INITIAL_LIKES) {
    try {
      const Like = Parse.Object.extend("Like");
      const like = new Like();
      const post = posts[likeData.postIndex];
      const user = users[likeData.userIndex];
      const profile = profiles[likeData.userIndex];

      like.set("postId", post.id);
      like.set("userId", user.id);
      like.set("username", profile.get("username"));

      await like.save(null, { useMasterKey: true });

      // Increment post's like count
      post.increment("likesCount");
      await post.save(null, { useMasterKey: true });

      console.log(
        `✓ @${profile.get("username")} liked post: "${post.get("body").substring(0, 30)}..."`
      );
    } catch (error) {
      console.error(`✗ Error creating like:`, error.message);
    }
  }
}

async function seedRetweets(posts, users, profiles) {
  console.log("\n🔄 Seeding retweets...");
  const createdRetweets = [];

  for (const retweetData of INITIAL_RETWEETS) {
    try {
      const originalPost = posts[retweetData.postIndex];
      const user = users[retweetData.userIndex];
      const profile = profiles[retweetData.userIndex];

      // Create Retweet relationship
      const Retweet = Parse.Object.extend("Retweet");
      const retweet = new Retweet();
      retweet.set("postId", originalPost.id);
      retweet.set("userId", user.id);
      retweet.set("username", profile.get("username"));
      await retweet.save(null, { useMasterKey: true });

      // Create retweet post
      const Post = Parse.Object.extend("Post");
      const retweetPost = new Post();
      retweetPost.set("authorId", profile.id);
      retweetPost.set("authorUsername", profile.get("username"));
      retweetPost.set("body", ""); // Retweets have empty body
      retweetPost.set("tag", originalPost.get("tag"));
      retweetPost.set("likesCount", 0);
      retweetPost.set("commentsCount", 0);
      retweetPost.set("retweetsCount", 0);
      retweetPost.set("isRetweet", true);
      retweetPost.set("originalPostId", originalPost.id);
      retweetPost.set("retweetedBy", profile.id);
      retweetPost.set("retweetedByUsername", profile.get("username"));

      const savedRetweetPost = await retweetPost.save(null, { useMasterKey: true });
      createdRetweets.push(savedRetweetPost);

      // Increment original post's retweet count
      originalPost.increment("retweetsCount");
      await originalPost.save(null, { useMasterKey: true });

      // Increment author's post count
      profile.increment("postsCount");
      await profile.save(null, { useMasterKey: true });

      console.log(
        `✓ @${profile.get("username")} retweeted: "${originalPost.get("body").substring(0, 30)}..."`
      );
    } catch (error) {
      console.error(`✗ Error creating retweet:`, error.message);
    }
  }

  return createdRetweets;
}

async function displaySummary(profiles, posts) {
  console.log("\n📊 Database Summary:");
  console.log("=====================================");

  for (const profile of profiles) {
    console.log(`\n@${profile.get("username")}:`);
    console.log(`  • ${profile.get("followersCount")} followers`);
    console.log(`  • ${profile.get("followingCount")} following`);
    console.log(`  • ${profile.get("postsCount")} posts`);
  }

  console.log(`\nTotal posts: ${posts.length}`);
  console.log(`Total comments: ${INITIAL_COMMENTS.length}`);
  console.log(`Total likes: ${INITIAL_LIKES.length}`);
  console.log(`Total retweets: ${INITIAL_RETWEETS.length}`);
  console.log("=====================================");
}

async function seedDatabase() {
  try {
    console.log("🚀 Starting database seeding...");
    console.log("=====================================\n");

    const { users, profiles } = await seedUsers();
    const posts = await seedPosts(profiles);
    await seedFollows(profiles);
    await seedComments(posts, profiles);
    await seedLikes(posts, users, profiles);
    const retweetPosts = await seedRetweets(posts, users, profiles);
    await displaySummary(profiles, [...posts, ...retweetPosts]);

    console.log("\n✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log("\nExiting...");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
