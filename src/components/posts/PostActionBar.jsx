import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { likePost, unlikePost } from "../../services/likes.js";
import { retweetPost, unretweetPost } from "../../services/retweets.js";
import Parse from "parse";

export default function PostActionBar({ post, onReply }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [retweetsCount, setRetweetsCount] = useState(post.retweetsCount || 0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLike = async () => {
    const currentUser = Parse.User.current();
    if (!currentUser) {
      navigate("/auth/login");
      return;
    }

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetweet = async () => {
    const currentUser = Parse.User.current();
    if (!currentUser) {
      navigate("/auth/login");
      return;
    }

    setIsLoading(true);
    try {
      // Get the current user's profile ID
      const { fetchProfileByUserId } = await import("../../services/profiles.js");
      const currentProfile = await fetchProfileByUserId(currentUser.id);
      
      if (!currentProfile) {
        console.error("Current user profile not found");
        return;
      }

      // Use the original post ID for retweet operations
      const targetPostId = post.originalPostId || post.id;
      
      if (isRetweeted) {
        await unretweetPost(currentProfile.id, targetPostId);
        setIsRetweeted(false);
        setRetweetsCount(prev => Math.max(0, prev - 1));
      } else {
        await retweetPost(currentProfile.id, currentProfile.username, targetPostId);
        setIsRetweeted(true);
        setRetweetsCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error toggling retweet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply();
    } else {
      navigate(`/post/${post.id}`);
    }
  };

  return (
    <div className="d-flex justify-content-around border-top pt-2 mt-2">
      <button
        className="btn btn-link text-muted p-0 d-flex align-items-center gap-1"
        title="Reply"
        onClick={handleReply}
      >
        <i className="bi bi-chat" style={{ fontSize: "1.2rem" }}></i>
        {post.commentsCount > 0 && (
          <span style={{ fontSize: "0.9rem" }}>{post.commentsCount}</span>
        )}
      </button>
      <button
        className={`btn btn-link p-0 d-flex align-items-center gap-1 ${
          isRetweeted ? "text-success" : "text-muted"
        }`}
        title={isRetweeted ? "Unretweet" : "Retweet"}
        onClick={handleRetweet}
        disabled={isLoading}
      >
        <i className="bi bi-arrow-repeat" style={{ fontSize: "1.2rem" }}></i>
        {retweetsCount > 0 && (
          <span style={{ fontSize: "0.9rem" }}>{retweetsCount}</span>
        )}
      </button>
      <button
        className={`btn btn-link p-0 d-flex align-items-center gap-1 ${
          isLiked ? "text-danger" : "text-muted"
        }`}
        title={isLiked ? "Unlike" : "Like"}
        onClick={handleLike}
        disabled={isLoading}
      >
        <i 
          className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`} 
          style={{ fontSize: "1.2rem" }}
        ></i>
        {likesCount > 0 && (
          <span style={{ fontSize: "0.9rem" }}>{likesCount}</span>
        )}
      </button>
    </div>
  );
}
