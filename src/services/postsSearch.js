import { fetchPostsWithAuthor } from "./posts";

/**
 * Stub for post search until Algolia/Elastic is integrated
 */
export const searchPosts = async (term, limit = 100) => {
  try {
    const posts = await fetchPostsWithAuthor(limit, 0);
    const low = term.toLowerCase().trim();
    return posts.filter((post) => {
      return (
        post.body.toLowerCase().includes(low) ||
        (post.tag && post.tag.toLowerCase().includes(low)) ||
        (post.author &&
          `${post.author.firstName} ${post.author.lastName}`
            .toLowerCase()
            .includes(low)) ||
        (post.hashtags &&
          post.hashtags.some((h) => h.toLowerCase().includes(low)))
      );
    });
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
};
