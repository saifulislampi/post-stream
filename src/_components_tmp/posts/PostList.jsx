import React from "react";
import PostItem from "./PostItem";

// PostList: Renders a list of posts or a message if empty
export default function PostList({ posts }) {
  // TODO: Add pagination or infinite scroll for large lists
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center p-4 text-muted">
        <p>No posts to display</p>
      </div>
    );
  }

  return (
    <section className="post-list-container">
      <ul className="post-list">
        {/* Each post is rendered as a PostItem */}
        {posts.map((post) => (
          <li key={post.id} className="post-list-item">
            <PostItem post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}