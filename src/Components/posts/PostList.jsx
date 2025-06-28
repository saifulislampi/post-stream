import React from "react";
import PostItem from "./PostItem";

export default function PostList({ posts, onSelect }) {
  return (
    <section>
      <h2>Timeline</h2>
      <ul>
        {posts.map(p => (
          <PostItem key={p.id} post={p} onClick={() => onSelect(p.id)} />
        ))}
      </ul>
    </section>
  );
}