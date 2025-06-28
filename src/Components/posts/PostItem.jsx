import React from "react";
import PostActionBar from "./PostActionBar";

export default function PostItem({ post, onClick }) {
  const fullName = `${post.user.firstName} ${post.user.lastName}`;

  return (
    <li className="post-card">
      <div onClick={onClick} style={{ cursor: "pointer" }}>
        <strong>{fullName}</strong>
        <span style={{ color: "#6b7280" }}> · #{post.tag}</span>
        <p>{post.body}</p>
      </div>
      <PostActionBar />
    </li>
  );
}