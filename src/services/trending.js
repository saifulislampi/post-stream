import Parse from "parse";
import { APPLICATION_ID, JAVASCRIPT_KEY, SERVER_URL } from "../environments.js";

// Initialize Parse if not already
if (!Parse.applicationId) {
  Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
  Parse.serverURL = SERVER_URL;
}

/**
 * Fetch trending hashtags over the past week.
 * Returns an array of { title: '#tag', count: 'X posts', hashtag: 'tag' }
 */
export async function getTrendingHashtags(limit = 3) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const Post = Parse.Object.extend("Post");
    const query = new Parse.Query(Post);
    query.greaterThan("createdAt", sevenDaysAgo);
    query.exists("hashtags");
    query.limit(1000);

    const posts = await query.find();
    const counts = {};
    posts.forEach(post => {
      const tags = post.get("hashtags") || [];
      tags.forEach(tag => {
        const key = tag.toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
      });
    });

    let items = Object.entries(counts)
      .map(([tag, count]) => ({ hashtag: tag, title: `#${tag}`, count: `${count} post${count !== 1 ? 's' : ''}` }))
      .sort((a, b) => parseInt(b.count) - parseInt(a.count));

    // Fill with placeholders if needed
    const filler = [
      { hashtag: 'javascript', title: '#javascript', count: '42 posts' },
      { hashtag: 'react', title: '#react', count: '35 posts' },
      { hashtag: 'webdev', title: '#webdev', count: '28 posts' }
    ];
    
    for (let idx = 0; items.length < limit && idx < filler.length; idx++) {
      const fillerItem = filler[idx];
      if (!items.find(x => x.hashtag === fillerItem.hashtag)) {
        items.push(fillerItem);
      }
    }

    return items.slice(0, limit);
  } catch (err) {
    console.error("Error fetching trending hashtags:", err);
    return [
      { hashtag: 'javascript', title: '#javascript', count: '42 posts' },
      { hashtag: 'react', title: '#react', count: '35 posts' },
      { hashtag: 'webdev', title: '#webdev', count: '28 posts' }
    ];
  }
}
