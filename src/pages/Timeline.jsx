import React from "react";
import PostForm from "../components/posts/PostForm";
import PostList from "../components/posts/PostList";
import SearchInput from "../components/shared/SearchInput";

export default function Timeline({ posts, onAdd, searchTerm, totalPosts, onSearch, currentUser }) {
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h4 fw-bold">Post Stream</h1>
        <SearchInput onSearch={onSearch} placeholder="Search posts..." />
      </div>
      <PostForm onAdd={onAdd} currentUser={currentUser} />
      {searchTerm && (
        <div className="alert alert-info my-3">
          {posts.length > 0 ? (
            <>Found {posts.length} post{posts.length !== 1 ? "s" : ""} matching "{searchTerm}"</>
          ) : (
            <>No posts found matching "{searchTerm}"</>
          )}
          {totalPosts && <span className="ms-2 opacity-75">(out of {totalPosts} total)</span>}
        </div>
      )}
      <PostList posts={posts} />
    </div>
  );
}