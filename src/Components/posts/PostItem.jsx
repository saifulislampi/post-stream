import React from "react";
import { Link } from "react-router-dom";
import PostActionBar from "./PostActionBar";

export default function PostItem({ post }) {
  const user = post.user || {};
  const fullName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.lastName
      ? user.firstName || user.lastName
      : "Loading...";

  return (
    <li className="post-card">
      <div>
        <strong>
          <Link 
            to={`/user/${user.id}`} 
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {fullName}
          </Link>
        </strong>
        <span style={{ color: "#6b7280" }}> · #{post.tag || 'general'}</span>
        <p>
          <Link 
            to={`/post/${post.id}`} 
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {post.body}
          </Link>
        </p>
      </div>
      <PostActionBar />
    </li>
  );
}