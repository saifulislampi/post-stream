import React from "react";
import { Link } from "react-router-dom";
import PostActionBar from "./PostActionBar";

function formatTimestamp(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function PostItem({ post }) {
  const user = post.user || {};
  const fullName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.lastName
      ? user.firstName || user.lastName
      : "Loading...";
  const formattedTimestamp = formatTimestamp(post.createdAt);

  return (
    <div className="card post-card mb-3">
      <div className="card-body">
        <div className="d-flex align-items-center mb-2">
          <strong>
            <Link to={`/user/${user.id}`} className="text-decoration-none text-reset">
              {fullName}
            </Link>
          </strong>
          {user.username && (
            <span className="text-muted ms-2">
              <Link to={`/user/${user.id}`} className="text-decoration-none text-reset">
                @{user.username}
              </Link>
            </span>
          )}
          <span className="text-muted ms-2"> · #{post.tag || "general"}</span>
          <span className="text-muted ms-2">
            <Link to={`/post/${post.id}`} className="text-decoration-none text-reset">
              {formattedTimestamp}
            </Link>
          </span>
        </div>
        <p className="card-text">{post.body}</p>
        <PostActionBar />
      </div>
    </div>
  );
}