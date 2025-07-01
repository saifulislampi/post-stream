import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostsWithAuthor } from "../../services/posts";
import { fetchCommentsByPost } from "../../services/comments";
import Spinner from "../shared/Spinner";

function formatTimestamp(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return new Date(date).toLocaleDateString(undefined, { 
    month: "short", 
    day: "numeric",
    year: new Date(date).getFullYear() !== now.getFullYear() ? "numeric" : undefined
  });
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    document.title = "Post Details - Post Stream";
    setLoading(true);
    setError(null);

    Promise.all([fetchPostsWithAuthor(), fetchCommentsByPost(id)])
      .then(([posts, comments]) => {
        const foundPost = posts.find((p) => p.id === id);
        if (!foundPost) {
          setError(`Post with ID ${id} not found`);
          return;
        }
        setPost(foundPost);
        setReplies(comments || []);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load post data");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setReplyLoading(true);
    try {
      // Simulate adding a reply (implement actual API call)
      const newReply = {
        id: Date.now().toString(),
        body: replyText,
        userId: "current-user-id",
        user: {
          firstName: "Current",
          lastName: "User"
        },
        createdAt: new Date().toISOString()
      };
      
      setReplies([newReply, ...replies]);
      setReplyText("");
    } catch (err) {
      console.error("Error posting reply:", err);
    } finally {
      setReplyLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="alert alert-danger p-4">{error}</div>;
  if (!post) return <div className="alert alert-warning p-4">Post not found</div>;

  const user = post.user || {};
  const fullName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.firstName || user.lastName || "Unknown User";

  return (
    <div className="post-detail">
      {/* Header */}
      <div className="post-detail-header">
        <div className="d-flex align-items-center">
          <button 
            className="btn btn-link p-2 me-3" 
            onClick={() => navigate(-1)}
            style={{ color: "var(--text-primary)" }}
          >
            <i className="bi bi-arrow-left" style={{ fontSize: "1.2rem" }}></i>
          </button>
          <div>
            <h6 className="mb-0 fw-bold">Post</h6>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="post-detail-content">
        <div className="post-detail-main">
          <div className="user-avatar me-3" style={{ width: "48px", height: "48px", fontSize: "1.2rem" }}>
            {user.firstName?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-1">
              <span className="fw-bold me-2">{fullName}</span>
              {user.username && (
                <span className="text-muted">@{user.username}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="post-detail-body">
          {post.body}
        </div>
        
        <div className="post-detail-meta">
          {formatTimestamp(post.createdAt)} • <span className="text-primary">#{post.tag || "general"}</span>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="post-actions-bar">
        <button className="post-action">
          <i className="bi bi-chat"></i>
          <span>{replies.length}</span>
        </button>
        <button className="post-action">
          <i className="bi bi-arrow-repeat"></i>
          <span>0</span>
        </button>
        <button className="post-action">
          <i className="bi bi-heart"></i>
          <span>0</span>
        </button>
        <button className="post-action">
          <i className="bi bi-share"></i>
        </button>
      </div>

      {/* Reply Section */}
      <div className="reply-section">
        <form onSubmit={handleReply} className="reply-form">
          <div className="user-avatar me-3" style={{ width: "40px", height: "40px", fontSize: "1rem" }}>
            U
          </div>
          <div className="flex-grow-1">
            <input
              type="text"
              className="reply-input w-100"
              placeholder="Post your reply"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={replyLoading}
            />
            <div className="d-flex justify-content-end mt-2">
              <button 
                type="submit" 
                className="reply-btn"
                disabled={!replyText.trim() || replyLoading}
              >
                {replyLoading ? "Posting..." : "Reply"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Replies List */}
      <div className="replies-list">
        {replies.map((reply) => (
          <div key={reply.id} className="reply-item">
            <div className="user-avatar me-3" style={{ width: "40px", height: "40px", fontSize: "1rem" }}>
              {reply.user?.firstName?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="reply-content">
              <div className="reply-author">
                <span className="fw-bold me-2">
                  {reply.user?.firstName && reply.user?.lastName 
                    ? `${reply.user.firstName} ${reply.user.lastName}` 
                    : "Unknown User"}
                </span>
                {reply.user?.username && (
                  <span className="text-muted me-2">@{reply.user.username}</span>
                )}
                <span className="text-muted">• {formatTimestamp(reply.createdAt)}</span>
              </div>
              <div className="reply-body">{reply.body}</div>
            </div>
          </div>
        ))}
        {replies.length === 0 && (
          <div className="text-center p-4 text-muted">
            No replies yet. Be the first to reply!
          </div>
        )}
      </div>
    </div>
  );
}