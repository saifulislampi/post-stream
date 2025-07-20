import Parse from "parse";
import { APPLICATION_ID, JAVASCRIPT_KEY, SERVER_URL } from "../environments.js";

// Initialize Parse
if (!Parse.applicationId) {
  Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
  Parse.serverURL = SERVER_URL;
}

/**
 * Search hashtags by name prefix (for autocomplete and results)
 */
export const searchHashtags = async (prefix, limit = 10) => {
  try {
    // Escape prefix to prevent regex injection
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const Post = Parse.Object.extend("Post");
    const query = new Parse.Query(Post);
    // Only fetch posts where at least one hashtag matches the prefix (server-side)
    const safe = escapeRegex(prefix);
    query.matches("hashtags", new RegExp(`^${safe}`, "i"));
    query.limit(limit);
    const posts = await query.find();
    const counts = new Map();
    // Tally counts only from the fetched posts (may miss less frequent tags)
    posts.forEach(p => {
      (p.get("hashtags") || []).forEach(tag => {
        if (tag.toLowerCase().startsWith(prefix.toLowerCase())) {
          counts.set(tag, (counts.get(tag) || 0) + 1);
        }
      });
    });
    const results = Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    return results;
  } catch (err) {
    console.error("Error in searchHashtags:", err);
    return [];
  }
};
