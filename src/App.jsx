import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./components/shared/Spinner";
import AppRoutes from "./routes/AppRoutes";
import { fetchPostsWithAuthor, createPost } from "./services/posts";
import { getCurrentUser, logout, login } from "./components/auth/AuthService";
import { fetchProfileByUserId } from "./services/profiles";

export default function App() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch profile and posts when currentUser changes and is not null
    const fetchProfileAndPosts = async () => {
      setLoading(true);
      try {
        if (currentUser) {
          const profile = await fetchProfileByUserId(currentUser.id);
          setCurrentProfile(profile);

          const postsData = await fetchPostsWithAuthor();
          setPosts(postsData);
        }
      } catch (error) {
        console.error("Error fetching profile and posts:", error);
      } finally {
        setLoading(false);
      }
    };

    // On initial mount, check if user is already logged in
    const checkLoggedInUser = async () => {
      setLoading(true);
      try {
        const user = getCurrentUser();
        if (user) {
          setCurrentUser(user);
          // Don't fetch profile/posts here - that will happen in the fetchProfileAndPosts effect
        }
      } catch (error) {
        console.error("Error checking logged in user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProfileAndPosts();
    } else {
      checkLoggedInUser();
    }
  }, [currentUser]);

  // Handler to add a new post
  const handleAddPost = async (raw) => {
    if (!currentProfile) return;

    try {
      const saved = await createPost(
        { ...raw, tag: raw.tag || "general" },
        currentProfile
      );

      const postWithAuthor = {
        ...saved,
        author: currentProfile,
      };

      setPosts([postWithAuthor, ...(posts ?? [])]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Handler for logout
  const handleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setCurrentProfile(null);
      setPosts(null);
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Handler for login
  const handleLogin = async (username, password) => {
    try {
      const { user, profile } = await login(username, password);
      setCurrentUser(user);
      setCurrentProfile(profile);
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="app">
      <AppRoutes
        currentUser={currentUser}
        currentProfile={currentProfile}
        onLogout={handleLogout}
        onLogin={handleLogin}
        onAddPost={handleAddPost}
        posts={posts}
      />
    </div>
  );
}
