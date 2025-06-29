import React from "react";
import PostForm from "../components/posts/PostForm";
import PostList from "../components/posts/PostList";

export default function Timeline({ posts, onAdd, searchTerm, totalPosts }) {
  return (
    <>
      <PostForm onAdd={onAdd} />
      {searchTerm && (
        <div style={{ 
          padding: '8px 16px', 
          backgroundColor: '#f0f9ff', 
          border: '1px solid #0ea5e9', 
          borderRadius: '8px', 
          marginBottom: '16px',
          color: '#0369a1'
        }}>
          {posts.length > 0 ? (
            <>Found {posts.length} post{posts.length !== 1 ? 's' : ''} matching "{searchTerm}"</>
          ) : (
            <>No posts found matching "{searchTerm}"</>
          )}
          {totalPosts && (
            <span style={{ marginLeft: '8px', opacity: 0.7 }}>
              (out of {totalPosts} total)
            </span>
          )}
        </div>
      )}
      <PostList posts={posts} />
    </>
  );
}
