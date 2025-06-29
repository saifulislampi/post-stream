import React from "react";
import PostForm from "../components/posts/PostForm";
import PostList from "../components/posts/PostList";

export default function Timeline({ posts, onAdd }) {
  return (
    <>
      <PostForm onAdd={onAdd} />
      <PostList posts={posts} />
    </>
  );
}
