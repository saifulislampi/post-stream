import React from "react";
import { Link } from "react-router-dom";
import PostActionBar from "./PostActionBar";
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

export default function RetweetedPost({ post }) {
  const originalPost = post.originalPost || post;
  const originalAuthor = originalPost.author || {};
  const retweeter = post.author || {}; // The person who retweeted (now in post.author)
  const retweeterName = retweeter.firstName && retweeter.lastName 
    ? `${retweeter.firstName} ${retweeter.lastName}`
    : retweeter.firstName || retweeter.lastName || retweeter.username || post.retweetedByUsername || "Someone";
  
  const fullName =
    originalAuthor.firstName && originalAuthor.lastName
      ? `${originalAuthor.firstName} ${originalAuthor.lastName}`
      : originalAuthor.firstName || originalAuthor.lastName || originalAuthor.username || "Unknown User";
  
  const formattedTimestamp = formatTimestamp(originalPost.createdAt);

  return (
    <article className="post-item">
      <div className="post-content">
        {/* Retweet header */}
        <div className="d-flex align-items-center gap-2 mb-2 text-muted" style={{ fontSize: "0.9rem" }}>
          <i className="bi bi-arrow-repeat"></i>
          <span>{retweeterName} retweeted</span>
        </div>

        <div className="d-flex gap-3">
          {/* Avatar */}
          <Link
            to={`/profile/${originalAuthor.id}`}
            className="text-decoration-none"
          >
            <Avatar profile={originalAuthor} size={48} />
          </Link>

          {/* Post Content */}
          <div className="flex-grow-1 min-width-0">
            {/* User Info */}
            <div className="d-flex align-items-center gap-1 mb-1">
              <Link
                to={`/profile/${originalAuthor.id}`}
                className="text-decoration-none"
              >
                <span className="fw-bold text-dark">{fullName}</span>
              </Link>
              <span className="text-muted">@{originalPost.authorUsername}</span>
              <span className="text-muted">·</span>
              <span className="text-muted">{formattedTimestamp}</span>
            </div>

            {/* Post Body */}
            <Link
              to={`/post/${originalPost.id}`}
              className="text-decoration-none"
            >
              <p className="mb-2 text-dark">{originalPost.body}</p>
            </Link>

            {/* Image */}
            {originalPost.imageUrl && (
              <div className="mb-3">
                <Link
                  to={`/post/${originalPost.id}`}
                  className="text-decoration-none"
                >
                  <img
                    src={originalPost.imageUrl}
                    alt="Post content"
                    className="img-fluid rounded"
                    style={{
                      maxHeight: "400px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Link>
              </div>
            )}

            {/* Post Actions - use originalPost for actions */}
            <PostActionBar post={originalPost} />
          </div>
        </div>
      </div>
    </article>
  );
}
