import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostsWithAuthor } from "../../services/posts";
import { fetchCommentsWithAuthor, createComment } from "../../services/comments";
import { likePost, unlikePost, isPostLiked } from "../../services/likes";
import Spinner from "../shared/Spinner";
import Parse from "parse";

function formatTimestamp(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year:
      new Date(date).getFullYear() !== now.getFullYear()
        ? "numeric"
        : undefined,
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
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  // Helper function to get current user's profile
  const getCurrentUserProfile = async () => {
    const currentUser = Parse.User.current();
    if (!currentUser) return null;
    
    try {
      const Profile = Parse.Object.extend("Profile");
      const profileQuery = new Parse.Query(Profile);
      profileQuery.equalTo("userId", currentUser.id);
      const userProfile = await profileQuery.first();
      return userProfile;
    } catch (error) {
      console.error("Error fetching current user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    document.title = "Post Details - Post Stream";
    setLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        // Load current user's profile
        const userProfile = await getCurrentUserProfile();
        setCurrentUserProfile(userProfile);

        // Load posts and comments
        const [posts, comments] = await Promise.all([
          fetchPostsWithAuthor(), 
          fetchCommentsWithAuthor(id)
        ]);

        const foundPost = posts.find((p) => p.id === id);
        if (!foundPost) {
          setError(`Post with ID ${id} not found`);
          return;
        }
        setPost(foundPost);
        setReplies(comments || []);
        setLikesCount(foundPost.likesCount || 0);
        
        // Debug: log comments to see structure
        console.log("Fetched comments:", comments);
        
        // Check if current user has liked this post
        const currentUser = Parse.User.current();
        if (currentUser) {
          const liked = await isPostLiked(currentUser.id, id);
          setIsLiked(liked);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load post data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const currentUser = Parse.User.current();
    if (!currentUser) {
      navigate("/auth/login");
      return;
    }

    let userProfile = currentUserProfile;
    
    // If no profile exists, try to create one or use fallback
    if (!userProfile) {
      try {
        // Try to fetch the profile again
        userProfile = await getCurrentUserProfile();
        
        // If still no profile, create a minimal one for comment attribution
        if (!userProfile) {
          console.warn("No profile found for user, using fallback data");
          // Use user data as fallback for comment attribution
          userProfile = {
            id: currentUser.id,
            get: (field) => {
              switch (field) {
                case "firstName": return currentUser.get("firstName") || "";
                case "lastName": return currentUser.get("lastName") || "";
                case "username": return currentUser.get("username") || "Unknown";
                default: return null;
              }
            }
          };
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Unable to load user profile. Please try again.");
        return;
      }
    }

    setReplyLoading(true);
    try {
      // Fetch the Parse Post object
      const Post = Parse.Object.extend("Post");
      const postQuery = new Parse.Query(Post);
      const postObj = await postQuery.get(post.id);

      // Create a new comment using the comment service
      const commentData = { body: replyText };
      const newComment = await createComment(commentData, userProfile, postObj);
      
      // Add author info for display using profile data
      const commentWithAuthor = {
        ...newComment,
        author: {
          id: userProfile.id,
          firstName: userProfile.get("firstName") || "",
          lastName: userProfile.get("lastName") || "",
          username: userProfile.get("username") || "Unknown",
        }
      };

      console.log("New comment with author:", commentWithAuthor); // Debug log

      setReplies([commentWithAuthor, ...replies]);
      setReplyText("");
      
      // Update post comments count in UI
      setPost(prev => ({
        ...prev,
        commentsCount: (prev.commentsCount || 0) + 1
      }));
    } catch (err) {
      console.error("Error posting reply:", err);
      alert("Failed to post reply. Please try again.");
    } finally {
      setReplyLoading(false);
    }
  };

  const handleLike = async () => {
    const currentUser = Parse.User.current();
    if (!currentUser) {
      navigate("/auth/login");
      return;
    }

    try {
      if (isLiked) {
        await unlikePost(currentUser.id, post.id);
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        await likePost(currentUser.id, currentUser.get("username"), post.id);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Failed to update like. Please try again.");
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="alert alert-danger p-4">{error}</div>;
  if (!post)
    return <div className="alert alert-warning p-4">Post not found</div>;

  const postAuthor = post.author || {};
  const fullName =
    postAuthor.firstName && postAuthor.lastName
      ? `${postAuthor.firstName} ${postAuthor.lastName}`
      : postAuthor.firstName || postAuthor.lastName || "Unknown User";

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
          <div
            className="user-avatar me-3"
            style={{ width: "48px", height: "48px", fontSize: "1.2rem" }}
          >
            {postAuthor.firstName?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-1">
              <span className="fw-bold me-2">{fullName}</span>
              {postAuthor.username && (
                <span className="text-muted">@{postAuthor.username}</span>
              )}
            </div>
          </div>
        </div>

        <div className="post-detail-body">{post.body}</div>
        
        {/* Post Image */}
        {post.imageUrl && (
          <div className="post-image-container mb-3">
            <img 
              src={post.imageUrl} 
              alt="Post attachment" 
              className="post-image"
              loading="lazy"
            />
          </div>
        )}

        <div className="post-detail-meta">
          {formatTimestamp(post.createdAt)} •{" "}
          <span className="text-primary">#{post.tag || "general"}</span>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="post-actions-bar">
        <button className="post-action" onClick={() => document.querySelector('.reply-input').focus()}>
          <i className="bi bi-chat"></i>
          <span>{post.commentsCount || 0}</span>
        </button>
        <button className="post-action" disabled>
          <i className="bi bi-arrow-repeat"></i>
          <span>0</span>
        </button>
        <button 
          className={`post-action ${isLiked ? 'text-danger' : ''}`}
          onClick={handleLike}
        >
          <i className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}></i>
          <span>{likesCount}</span>
        </button>
        <button className="post-action" disabled>
          <i className="bi bi-share"></i>
        </button>
      </div>

      {/* Reply Section */}
      <div className="reply-section">
        <form onSubmit={handleReply} className="reply-form">
          <div
            className="user-avatar me-3"
            style={{ width: "40px", height: "40px", fontSize: "1rem" }}
          >
            {currentUserProfile?.get("firstName")?.[0]?.toUpperCase() || "?"}
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
            <div
              className="user-avatar me-3"
              style={{ width: "40px", height: "40px", fontSize: "1rem" }}
            >
              {(() => {
                // Handle both new comments (with author) and existing comments (with author)
                const author = reply.author;
                if (author && author.firstName) {
                  return author.firstName[0].toUpperCase();
                }
                // Fallback to authorUsername if no author info
                const username = reply.authorUsername || "U";
                return username[0].toUpperCase();
              })()}
            </div>
            <div className="reply-content">
              <div className="reply-author">
                <span className="fw-bold me-2">
                  {(() => {
                    // Handle both new comments (with author) and existing comments (with author)
                    const author = reply.author;
                    if (author) {
                      if (author.firstName && author.lastName) {
                        return `${author.firstName} ${author.lastName}`;
                      } else if (author.firstName || author.lastName) {
                        return author.firstName || author.lastName;
                      }
                    }
                    // Fallback to authorUsername if no author info
                    return reply.authorUsername || "Unknown User";
                  })()}
                </span>
                {reply.author?.username && (
                  <span className="text-muted me-2">
                    @{reply.author.username}
                  </span>
                )}
                <span className="text-muted">
                  • {formatTimestamp(reply.createdAt)}
                </span>
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
