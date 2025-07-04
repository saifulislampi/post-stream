import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostsWithAuthor } from "../services/posts";
import { fetchUserById } from "../services/users";
import { isFollowing, followUser, unfollowUser } from "../services/follows";
import Spinner from "../components/shared/Spinner";
import PostList from "../components/posts/PostList";

import "../styles/ProfilePage.css"; // Assuming you have some styles for the profile page

// TODO: Consider adding user bio and location fields in the future
function getInitials(user) {
  if (!user) return "?";
  if (user.firstName && user.lastName)
    return user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase();
  if (user.firstName) return user.firstName[0].toUpperCase();
  if (user.lastName) return user.lastName[0].toUpperCase();
  return "?";
}

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isHoveringFollow, setIsHoveringFollow] = useState(false);

  useEffect(() => {
    // TODO: Add error handling for failed user fetch
    const storedUserId = localStorage.getItem("currentUserId");
    if (storedUserId) {
      setCurrentUserId(storedUserId);
    } else {
      import("../services/users").then(({ fetchFirstUser }) => {
        fetchFirstUser().then((user) => {
          if (user) {
            localStorage.setItem("currentUserId", user.id);
            setCurrentUserId(user.id);
          }
        });
      });
    }
  }, []);

  useEffect(() => {
    document.title = "Profile - Post Stream";
    setLoading(true);
    // TODO: Optimize to avoid unnecessary fetches on every userId/currentUserId change
    Promise.all([fetchUserById(userId), fetchPostsWithAuthor()])
      .then(([userData, allPosts]) => {
        setUser(userData);
        setPosts(allPosts.filter((p) => p.userId === userId));
        if (currentUserId && currentUserId !== userId) {
          isFollowing(currentUserId, userId).then(setIsFollowingUser);
        }
      })
      .finally(() => setLoading(false));
  }, [userId, currentUserId]);

  const handleFollowToggle = async () => {
    if (!currentUserId) return;
    setFollowLoading(true);
    try {
      if (isFollowingUser) {
        await unfollowUser(currentUserId, userId);
        setIsFollowingUser(false);
        setUser((prev) => ({
          ...prev,
          followersCount: Math.max(0, (prev.followersCount || 0) - 1),
        }));
      } else {
        await followUser(currentUserId, userId);
        setIsFollowingUser(true);
        setUser((prev) => ({
          ...prev,
          followersCount: (prev.followersCount || 0) + 1,
        }));
      }
    } catch (err) {
      // TODO: Show user feedback on follow/unfollow error
      console.error("Follow action failed:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (!user)
    return <div className="alert alert-warning p-3">User not found</div>;

  const isOwnProfile = currentUserId === userId;

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="d-flex align-items-center mb-3">
          <button
            className="btn btn-link p-2 me-3"
            onClick={() => navigate(-1)}
            style={{ color: "var(--text-primary)" }}
          >
            <i className="bi bi-arrow-left" style={{ fontSize: "1.2rem" }}></i>
          </button>
          <div>
            <h1 className="h4 mb-0 fw-bold">
              {user.firstName} {user.lastName}
            </h1>
            <div className="text-muted small">{posts?.length || 0} posts</div>
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="profile-info">
        <div className="profile-banner">
          {/* You can add a banner image here later */}
        </div>

        <div className="profile-details">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="profile-avatar-large">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="profile"
                  className="w-100 h-100 rounded-circle"
                />
              ) : (
                getInitials(user)
              )}
            </div>

            {!isOwnProfile && (
              <button
                onMouseEnter={() => setIsHoveringFollow(true)}
                onMouseLeave={() => setIsHoveringFollow(false)}
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`profile-follow-btn ${isFollowingUser ? "following" : ""}`}
              >
                {followLoading
                  ? (isFollowingUser ? "Unfollowing..." : "Following...")
                  : isFollowingUser
                    ? isHoveringFollow
                      ? "Unfollow"
                      : "Following"
                    : "Follow"}
              </button>
            )}
          </div>

          <div className="profile-user-info">
            <h2 className="profile-name">
              {user.firstName} {user.lastName}
            </h2>
            <div className="profile-handle">
              @{user.username || `user${user.id.substring(0, 4)}`}
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{user.followingCount || 0}</span>
                <span className="stat-label">Following</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.followersCount || 0}</span>
                <span className="stat-label">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="profile-tabs">
        <div className="tab-item active">
          <span>Posts</span>
        </div>
        <div className="tab-item">
          <span>Replies</span>
        </div>
        <div className="tab-item">
          <span>Media</span>
        </div>
        <div className="tab-item">
          <span>Likes</span>
        </div>
      </div>

      {/* Posts Section */}
      <div className="profile-posts">
        <PostList posts={posts || []} />
      </div>
    </div>
  );
}
