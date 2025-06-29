import React from "react";
import { useNavigate } from "react-router-dom";
import PostItem from "./PostItem";

export default function PostList({ posts }) {
  const navigate = useNavigate();

  return (
    <section>
      <h2>Timeline</h2>
      <ul>
        {posts.map(p => (
          <PostItem 
            key={p.id} 
            post={p} 
            onClick={() => navigate(`/post/${p.id}`)}
          />
        ))}
      </ul>
    </section>
  );
}