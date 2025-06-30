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
    // Get current user from local storage or context
    const storedUserId = localStorage.getItem("currentUserId");
    if (storedUserId) {
      setCurrentUserId(storedUserId);
    } else {
      // For demo, grab the first user as current user
      import("../services/users").then(({ fetchFirstUser }) => {
        fetchFirstUser().then(user => {
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
    Promise.all([
      fetchUserById(userId),
      fetchPostsWithAuthor()
    ]).then(([userData, allPosts]) => {
      setUser(userData);
      setPosts(allPosts.filter(p => p.userId === userId));
      
      // Check follow status if we have both current user and profile user
      if (currentUserId && currentUserId !== userId) {
        isFollowing(currentUserId, userId).then(setIsFollowingUser);
      }
    }).finally(() => setLoading(false));
  }, [userId, currentUserId]);

  const handleFollowToggle = async () => {
    if (!currentUserId) return;
    
    setFollowLoading(true);
    try {
      if (isFollowingUser) {
        await unfollowUser(currentUserId, userId);
        setIsFollowingUser(false);
        // Update follower count on UI
        setUser(prev => ({ 
          ...prev, 
          followersCount: Math.max(0, (prev.followersCount || 0) - 1) 
        }));
      } else {
        await followUser(currentUserId, userId);
        setIsFollowingUser(true);
        // Update follower count on UI
        setUser(prev => ({ 
          ...prev, 
          followersCount: (prev.followersCount || 0) + 1 
        }));
      }
    } catch (err) {
      console.error('Follow action failed:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (!user) return <div>User not found</div>;

  const isOwnProfile = currentUserId === userId;

  return (
    <div className="container" style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        marginBottom: 30,
        padding: "20px",
        backgroundColor: "var(--card-bg, #f9fafb)",
        borderRadius: "12px",
        border: "1px solid var(--border-color, #e5e7eb)"
      }}>
        {/* Profile Picture */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "var(--accent, #1d9bf0)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          fontWeight: 700
        }}>
          {user.imageUrl
            ? <img src={user.imageUrl} alt="profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
            : getInitials(user)
          }
        </div>

        {/* User Info */}
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: "24px" }}>{user.firstName} {user.lastName}</h2>
          <div style={{ color: "var(--text-muted, #6b7280)", marginBottom: "4px" }}>
            @{user.username || `user${user.id.substring(0, 4)}`}
          </div>
          <div style={{ color: "var(--text-muted, #6b7280)", fontSize: "14px", marginBottom: "10px" }}>
            {user.email}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "20px", fontSize: "14px" }}>
            <span><strong>{user.followersCount || 0}</strong> Followers</span>
            <span><strong>{user.followingCount || 0}</strong> Following</span>
            <span><strong>{posts?.length || 0}</strong> Posts</span>
          </div>
        </div>

        {/* Follow Button (only show if not own profile) */}
        {!isOwnProfile && (
          <button
            onClick={handleFollowToggle}
            disabled={followLoading}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: isFollowingUser ? "1px solid var(--accent, #1d9bf0)" : "none",
              backgroundColor: isFollowingUser ? "transparent" : "var(--accent, #1d9bf0)",
              color: isFollowingUser ? "var(--accent, #1d9bf0)" : "#fff",
              fontWeight: "bold",
              cursor: followLoading ? "not-allowed" : "pointer",
              opacity: followLoading ? 0.7 : 1
            }}
          >
            {followLoading ? "..." : isFollowingUser ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      {/* Posts Section - Using PostItem component */}
      <div>
        <h3 style={{ marginBottom: "20px" }}>Posts</h3>
        {posts && posts.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {posts.map(post => (
              <PostItem key={post.id} post={post} />
            ))}
          </ul>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "40px",
            color: "var(--text-muted, #6b7280)",
            backgroundColor: "var(--card-bg, #f9fafb)",
            borderRadius: "12px",
            border: "1px solid var(--border-color, #e5e7eb)"
          }}>
            {isOwnProfile ? "You haven't posted anything yet." : "No posts yet."}
          </div>
        )}
      </div>
    </div>
  );
}