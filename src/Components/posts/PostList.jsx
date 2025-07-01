import React from "react";
import PostItem from "./PostItem";

export default function PostList({ posts }) {
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
        {posts.map((post) => (
          <li key={post.id} className="post-list-item">
            <PostItem post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}