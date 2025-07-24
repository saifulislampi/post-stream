import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostsByProfileWithAuthor } from "../services/posts";
import { fetchProfileById, fetchProfileByUserId } from "../services/profiles";
import {
  isFollowing,
  followProfile,
  unfollowProfile,
} from "../services/follows";
import { getCurrentUser } from "../components/auth/AuthService";
import Spinner from "../components/shared/Spinner";
import PostList from "../components/posts/PostList";
import ProfilePhotoUpload from "../components/profile/ProfilePhotoUpload";

import "../styles/ProfilePage.css";

// Helper function to get user initials for avatar
function getInitials(profile) {
  if (!profile) return "?";
  if (profile.firstName && profile.lastName)
    return (
      profile.firstName[0].toUpperCase() + profile.lastName[0].toUpperCase()
    );
  if (profile.firstName) return profile.firstName[0].toUpperCase();
  if (profile.lastName) return profile.lastName[0].toUpperCase();
  return "?";
}

export default function ProfilePage({ onProfileUpdate }) {
  const { profileId } = useParams(); // Changed from userId to profileId
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isHoveringFollow, setIsHoveringFollow] = useState(false);

  // Get current user profile on component mount
  useEffect(() => {
    const loadCurrentProfile = async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          const currentUserProfile = await fetchProfileByUserId(currentUser.id);
          setCurrentProfile(currentUserProfile);
        }
      } catch (error) {
        console.error("Error loading current profile:", error);
      }
    };

    loadCurrentProfile();
  }, []);

  // Load profile and posts when profileId changes
  useEffect(() => {
    document.title = "Profile - Post Stream";
    setLoading(true);

    const loadProfileAndPosts = async () => {
      try {
        let profileData = null;

        // First try to fetch by Profile ID
        try {
          profileData = await fetchProfileById(profileId);
        } catch (error) {
          // Try fetching by User ID instead
        }

        // If that fails, try to fetch by User ID
        if (!profileData) {
          try {
            profileData = await fetchProfileByUserId(profileId);

            // If successful, redirect to the correct profile URL
            if (profileData && profileData.id !== profileId) {
              navigate(`/profile/${profileData.id}`, { replace: true });
              return;
            }
          } catch (error) {
            console.error("Error fetching profile by User ID:", error);
          }
        }

        if (!profileData) {
          console.error("Profile not found for ID:", profileId);
          setLoading(false);
          return;
        }

        setProfile(profileData);

        // Get posts by this profile with author information
        const profilePosts = await fetchPostsByProfileWithAuthor(profileData.id);
        setPosts(profilePosts);

        // Check if current user is following this profile
        if (currentProfile && currentProfile.id !== profileData.id) {
          const following = await isFollowing(
            currentProfile.id,
            profileData.id
          );
          setIsFollowingUser(following);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (profileId) {
      loadProfileAndPosts();
    }
  }, [profileId, currentProfile, navigate]);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const handleFollowToggle = async () => {
    if (!currentProfile) return;
    setFollowLoading(true);

    try {
      if (isFollowingUser) {
        await unfollowProfile(currentProfile, profile);
        setIsFollowingUser(false);
        setProfile((prev) => ({
          ...prev,
          followersCount: Math.max(0, (prev.followersCount || 0) - 1),
        }));
        
        // Update the current user's following count and notify parent
        const updatedCurrentProfile = {
          ...currentProfile,
          followingCount: Math.max(0, (currentProfile.followingCount || 0) - 1),
        };
        setCurrentProfile(updatedCurrentProfile);
        if (onProfileUpdate) {
          console.log('ProfilePage: Calling onProfileUpdate after unfollow, new followingCount:', updatedCurrentProfile.followingCount);
          onProfileUpdate(updatedCurrentProfile);
        }
      } else {
        await followProfile(currentProfile, profile);
        setIsFollowingUser(true);
        setProfile((prev) => ({
          ...prev,
          followersCount: (prev.followersCount || 0) + 1,
        }));
        
        // Update the current user's following count and notify parent
        const updatedCurrentProfile = {
          ...currentProfile,
          followingCount: (currentProfile.followingCount || 0) + 1,
        };
        setCurrentProfile(updatedCurrentProfile);
        if (onProfileUpdate) {
          console.log('ProfilePage: Calling onProfileUpdate after follow, new followingCount:', updatedCurrentProfile.followingCount);
          onProfileUpdate(updatedCurrentProfile);
        }
      }
    } catch (err) {
      console.error("Follow action failed:", err);
      // TODO: Show user feedback on follow/unfollow error
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (!profile)
    return <div className="alert alert-warning p-3">Profile not found</div>;

  const isOwnProfile = currentProfile?.id === profile.id;

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
              {profile.firstName} {profile.lastName}
            </h1>
            <div className="text-muted small">{posts?.length || 0} posts</div>
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="profile-info">
        <div className="profile-banner">
          {profile.coverImage && (
            <img
              src={profile.coverImage}
              alt="cover"
              className="w-100 h-100 object-cover"
            />
          )}
        </div>

        <div className="profile-details">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="profile-avatar-container">
              <div className="profile-avatar-large">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="profile"
                    className="w-100 h-100 rounded-circle"
                  />
                ) : (
                  getInitials(profile)
                )}
              </div>
              {isOwnProfile && (
                <ProfilePhotoUpload 
                  profile={profile} 
                  onProfileUpdate={handleProfileUpdate} 
                />
              )}
            </div>

            {!isOwnProfile && currentProfile && (
              <button
                onMouseEnter={() => setIsHoveringFollow(true)}
                onMouseLeave={() => setIsHoveringFollow(false)}
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`profile-follow-btn ${
                  isFollowingUser ? "following" : ""
                }`}
              >
                {followLoading
                  ? isFollowingUser
                    ? "Unfollowing..."
                    : "Following..."
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
              {profile.firstName} {profile.lastName}
            </h2>
            <div className="profile-handle">@{profile.username}</div>

            {profile.bio && (
              <div className="profile-bio mb-2">{profile.bio}</div>
            )}

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">
                  {profile.followingCount || 0}
                </span>
                <span className="stat-label">Following</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {profile.followersCount || 0}
                </span>
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
