import React from "react";
import PostItem from "./PostItem";

export default function PostList({ posts }) {
  return (
    <section>
      {/* <h2 className="h5 mb-3">Timeline</h2> */}
      <ul className="p-0">
        {posts.map((p) => (
          <PostItem key={p.id} post={p} />
        ))}
      </ul>
    </section>
  );
}