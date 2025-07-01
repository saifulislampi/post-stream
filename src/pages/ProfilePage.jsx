import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostsWithAuthor } from "../services/posts";
import { fetchUserById } from "../services/users";
import { isFollowing, followUser, unfollowUser } from "../services/follows";
import Spinner from "../components/shared/Spinner";
import PostItem from "../components/posts/PostItem";

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
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
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
    document.title = "Profile Page - Post Stream";
    setLoading(true);
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
      console.error("Follow action failed:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (!user) return <div className="alert alert-warning p-3">User not found</div>;

  const isOwnProfile = currentUserId === userId;

  return (
    <div className="container" style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-white rounded border">
        <div
          className="profile-avatar"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "var(--accent)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px",
            fontWeight: "700",
          }}
        >
          {user.imageUrl ? (
            <img src={user.imageUrl} alt="profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
          ) : (
            getInitials(user)
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h2 className="h5 mb-1">
            {user.firstName} {user.lastName}
          </h2>
          <div className="text-muted mb-2">@{user.username || `user${user.id.substring(0, 4)}`}</div>
          <div className="small text-muted mb-2">{user.email}</div>
          <div className="d-flex gap-3 small">
            <span>
              <strong>{user.followersCount || 0}</strong> Followers
            </span>
            <span>
              <strong>{user.followingCount || 0}</strong> Following
            </span>
            <span>
              <strong>{posts?.length || 0}</strong> Posts
            </span>
          </div>
        </div>
        {!isOwnProfile && (
          <button
            onClick={handleFollowToggle}
            disabled={followLoading}
            className="btn btn-outline-primary"
            style={{
              borderRadius: "20px",
            }}
          >
            {followLoading ? "..." : isFollowingUser ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>
      <div>
        <h3 className="h6 mb-3">Posts</h3>
        {posts && posts.length > 0 ? (
          <ul className="list-unstyled">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </ul>
        ) : (
          <div className="text-center p-4 border rounded">
            {isOwnProfile ? "You haven't posted anything yet." : "No posts yet."}
          </div>
        )}
      </div>
    </div>
  );
}