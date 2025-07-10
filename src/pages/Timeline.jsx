import React from "react";
import PostForm from "../components/posts/PostForm";
import PostList from "../components/posts/PostList";

// Note: No search input on homepage per requirements
export default function Timeline({ posts, onAdd, currentUser }) {
  return (
    <div className="container-main">
      <PostForm onAdd={onAdd} currentUser={currentUser} />
      <PostList posts={posts} />
    </div>
  );
}
