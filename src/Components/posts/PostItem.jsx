import React from "react";
import PostActionBar from "./PostActionBar";

export default function PostItem({ post, onClick }) {
  // Handle case where user data might not be loaded yet
  const user = post.user || {};
  const fullName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.firstName || user.lastName 
    ? (user.firstName || user.lastName)
    : 'Loading...';

  return (
    <li className="post-card">
      <div onClick={onClick} style={{ cursor: "pointer" }}>
        <strong>{fullName}</strong>
        <span style={{ color: "#6b7280" }}> · #{post.tag || 'general'}</span>
        <p>{post.body}</p>
      </div>
      <PostActionBar />
    </li>
  );
}