import React from "react";
import { Link } from "react-router-dom";
import PostActionBar from "./PostActionBar";

// Helper function to format timestamp in social media style
function formatTimestamp(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000); // Difference in seconds

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;

  // If older than a day, show the date
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
    <li className="post-card">
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: "4px",
          }}
        >
          <strong>
            <Link
              to={`/user/${user.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {fullName}
            </Link>
          </strong>
          {user.username && (
            <span style={{ color: "var(--text-muted, #6b7280)" }}>
              <Link
                to={`/user/${user.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                @{user.username}
              </Link>
            </span>
          )}
          <span style={{ color: "var(--text-muted, #6b7280)" }}>
            {" "}
            · #{post.tag || "general"}
          </span>
          <span style={{ color: "var(--text-muted, #6b7280)" }}>
            {" "}
            ·{" "}
            <Link
              to={`/post/${post.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {formattedTimestamp}
            </Link>
          </span>
        </div>
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