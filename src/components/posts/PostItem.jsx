import React from "react";
import { Link } from "react-router-dom";
import PostActionBar from "./PostActionBar";
import RetweetedPost from "./RetweetedPost";
import Avatar from "../shared/Avatar";

function formatTimestamp(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function PostItem({ post }) {
  // If this is a retweet, use the RetweetedPost component
  if (post.isRetweet) {
    return <RetweetedPost post={post} />;
  }

  const postAuthor = post.author || {};
  const fullName =
    postAuthor.firstName && postAuthor.lastName
      ? `${postAuthor.firstName} ${postAuthor.lastName}`
      : postAuthor.firstName || postAuthor.lastName || "Unknown User";
  const formattedTimestamp = formatTimestamp(post.createdAt);

  return (
    <article className="post-item">
      <div className="post-content">
        <div className="d-flex gap-3">
          {/* Avatar */}
          <Link
            to={`/profile/${postAuthor.id}`}
            className="text-decoration-none"
          >
            <Avatar profile={postAuthor} size={48} />
          </Link>

          {/* Post Content */}
          <div className="flex-grow-1 min-width-0">
            {/* User Info */}
            <div className="d-flex align-items-center gap-1 mb-1">
              <Link
                to={`/profile/${postAuthor.id}`}
                className="text-decoration-none"
              >
                <span className="fw-bold text-dark">{fullName}</span>
              </Link>
              {postAuthor.username && (
                <span className="text-muted">@{postAuthor.username}</span>
              )}
              <span className="text-muted">·</span>
              <Link to={`/post/${post.id}`} className="text-decoration-none">
                <span className="text-muted">{formattedTimestamp}</span>
              </Link>
            </div>

            {/* Post Body */}
            <div className="post-body mb-2">
              <Link
                to={`/post/${post.id}`}
                className="text-decoration-none text-dark"
              >
                {post.body}
              </Link>
            </div>

            {/* Post Image */}
            {post.imageUrl && (
              <div className="post-image-container mb-2">
                <Link to={`/post/${post.id}`}>
                  <img 
                    src={post.imageUrl} 
                    alt="Post attachment" 
                    className="post-image"
                    loading="lazy"
                  />
                </Link>
              </div>
            )}

            {/* Post Actions */}
            <PostActionBar post={post} />
          </div>
        </div>
      </div>
    </article>
  );
}
