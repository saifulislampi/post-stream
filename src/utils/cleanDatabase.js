/**
 * Clean up Back4App database
 */
const Parse = require("parse/node");

// Back4App configuration
const APPLICATION_ID = "3gMH4Kq9ALoTgvRaYN0STLZPBRBrw6HzlIqytZzf";
const JAVASCRIPT_KEY = "V1OcAlaeBrZwruPBmMjT2d0nIZ1r5rSI7ONSSPKN";
const MASTER_KEY = "neaO4TBGd5NKjtuDRjEt7Sqazr32LmyLYp06A9Wg";
const SERVER_URL = "https://parseapi.back4app.com/";

// Initialize Parse with master key for cleanup
Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY, MASTER_KEY);
Parse.serverURL = SERVER_URL;
Parse.masterKey = MASTER_KEY;

async function cleanupDatabase() {
  try {
    console.log("🧹 Starting database cleanup...");
    console.log("=====================================\n");

    // Clean up in reverse dependency order

    // 1. Clean up Likes
    console.log("Cleaning up Likes...");
    try {
      const LikeQuery = new Parse.Query("Like");
      LikeQuery.limit(1000);
      const likes = await LikeQuery.find({ useMasterKey: true });
      if (likes.length > 0) {
        await Parse.Object.destroyAll(likes, { useMasterKey: true });
        console.log(`✓ Deleted ${likes.length} likes`);
      } else {
        console.log("✓ No likes found");
      }
    } catch (error) {
      console.error("✗ Error deleting likes:", error.message);
    }

    // 2. Clean up Retweets
    console.log("\nCleaning up Retweets...");
    try {
      const RetweetQuery = new Parse.Query("Retweet");
      RetweetQuery.limit(1000);
      const retweets = await RetweetQuery.find({ useMasterKey: true });
      if (retweets.length > 0) {
        await Parse.Object.destroyAll(retweets, { useMasterKey: true });
        console.log(`✓ Deleted ${retweets.length} retweets`);
      } else {
        console.log("✓ No retweets found");
      }
    } catch (error) {
      console.error("✗ Error deleting retweets:", error.message);
    }

    // 3. Clean up Comments
    console.log("\nCleaning up Comments...");
    try {
      const CommentQuery = new Parse.Query("Comment");
      CommentQuery.limit(1000);
      const comments = await CommentQuery.find({ useMasterKey: true });
      if (comments.length > 0) {
        await Parse.Object.destroyAll(comments, { useMasterKey: true });
        console.log(`✓ Deleted ${comments.length} comments`);
      } else {
        console.log("✓ No comments found");
      }
    } catch (error) {
      console.error("✗ Error deleting comments:", error.message);
    }

    // 4. Clean up Follow relationships
    console.log("\nCleaning up Follow relationships...");
    try {
      const FollowQuery = new Parse.Query("Follow");
      FollowQuery.limit(1000);
      const follows = await FollowQuery.find({ useMasterKey: true });
      if (follows.length > 0) {
        await Parse.Object.destroyAll(follows, { useMasterKey: true });
        console.log(`✓ Deleted ${follows.length} follow relationships`);
      } else {
        console.log("✓ No follow relationships found");
      }
    } catch (error) {
      console.error("✗ Error deleting follows:", error.message);
    }

    // 5. Clean up Posts
    console.log("\nCleaning up Posts...");
    try {
      const PostQuery = new Parse.Query("Post");
      PostQuery.limit(1000);
      const posts = await PostQuery.find({ useMasterKey: true });
      if (posts.length > 0) {
        await Parse.Object.destroyAll(posts, { useMasterKey: true });
        console.log(`✓ Deleted ${posts.length} posts`);
      } else {
        console.log("✓ No posts found");
      }
    } catch (error) {
      console.error("✗ Error deleting posts:", error.message);
    }

    // 6. Clean up Profiles
    console.log("\nCleaning up Profiles...");
    try {
      const ProfileQuery = new Parse.Query("Profile");
      ProfileQuery.limit(1000);
      const profiles = await ProfileQuery.find({ useMasterKey: true });
      if (profiles.length > 0) {
        await Parse.Object.destroyAll(profiles, { useMasterKey: true });
        console.log(`✓ Deleted ${profiles.length} profiles`);
      } else {
        console.log("✓ No profiles found");
      }
    } catch (error) {
      console.error("✗ Error deleting profiles:", error.message);
    }

    // 7. Clean up Parse Users
    console.log("\nCleaning up Parse Users...");
    try {
      const UserQuery = new Parse.Query(Parse.User);
      UserQuery.limit(1000);
      const users = await UserQuery.find({ useMasterKey: true });
      if (users.length > 0) {
        // Delete users one by one with master key
        for (const user of users) {
          await user.destroy({ useMasterKey: true });
        }
        console.log(`✓ Deleted ${users.length} Parse users`);
      } else {
        console.log("✓ No Parse users found");
      }
    } catch (error) {
      console.error("✗ Error deleting Parse users:", error.message);
      console.log(
        "  Note: You may need to delete users manually from Back4App dashboard"
      );
    }

    console.log("\n✅ Database cleanup completed!");
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  }
}

// Run the cleanup
cleanupDatabase()
  .then(() => {
    console.log("\nExiting...");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Cleanup failed:", error);
    process.exit(1);
  });
