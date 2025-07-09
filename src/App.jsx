import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"; // Remove BrowserRouter import

import Header from "./components/layout/Header";
import RightSidebar from "./components/layout/RightSidebar";
import Spinner from "./components/shared/Spinner";

import Timeline from "./pages/Timeline";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import ExplorePage from "./pages/ExplorePage";

import AuthModule from "./components/auth/AuthModule";
import AuthLogin from "./components/auth/AuthLogin";
import AuthRegister from "./components/auth/AuthRegister";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

import { fetchPostsWithAuthor, createPost } from "./services/posts";
import { getCurrentUser, logout, login } from "./components/auth/AuthService";
import { fetchProfileByUserId } from "./services/profiles";

export default function App() {
  const navigate = useNavigate();
  // State for all posts loaded from backend
  const [posts, setPosts] = useState(null);
  // State for the currently logged-in user via Parse
  const [currentUser, setCurrentUser] = useState(null);
  // Add state for current profile
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

  // Handler to add a new post (called from PostForm)
  const handleAdd = async (raw) => {
    if (!currentProfile) return;

    try {
      const saved = await createPost(
        {
          ...raw,
          tag: raw.tag || "general",
        },
        currentProfile
      );

      const postWithAuthor = {
        ...saved,
        author: currentProfile, // what Timeline/PostItem expects
      };

      setPosts([postWithAuthor, ...(posts ?? [])]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

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

  const handleLogin = async (username, password) => {
    try {
      // Login with Parse and get profile
      const { user, profile } = await login(username, password);

      // Update App state
      setCurrentUser(user);
      setCurrentProfile(profile);

      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      throw error; // Re-throw so login form can display error
    }
  };

  // Show loading spinner while initializing
  if (loading) return <Spinner />;

  return (
    <div className="app">
      <Routes>
        {/* Public Auth Routes - redirect to home if already logged in */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthModule />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthLogin onLogin={handleLogin} />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <AuthRegister />
            </PublicRoute>
          }
        />

        {/* Protected App Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <>
                {/* Pass both user and profile */}
                <Header
                  currentUser={currentUser}
                  currentProfile={currentProfile}
                  onLogout={handleLogout}
                />

                <div className="container-fluid p-0">
                  <div className="row g-0 justify-content-center">
                    <main className="col-12 col-lg-6 col-xl-5 main-content">
                      <Timeline
                        posts={posts}
                        onAdd={handleAdd}
                        currentUser={currentUser}
                        currentProfile={currentProfile}
                      />
                    </main>
                    <RightSidebar />
                  </div>
                </div>
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <>
                <Header
                  currentUser={currentUser}
                  currentProfile={currentProfile}
                  onLogout={handleLogout}
                />
                <div className="container-fluid p-0">
                  <div className="row g-0 justify-content-center">
                    <main className="col-12 col-lg-6 col-xl-5 main-content">
                      <PostPage currentProfile={currentProfile} />
                    </main>
                    <RightSidebar />
                  </div>
                </div>
              </>
            </ProtectedRoute>
          }
        />

        {/* Change from /user/:userId to /profile/:profileId */}
        <Route
          path="/profile/:profileId"
          element={
            <ProtectedRoute>
              <>
                <Header
                  currentUser={currentUser}
                  currentProfile={currentProfile}
                  onLogout={handleLogout}
                />
                <div className="container-fluid p-0">
                  <div className="row g-0 justify-content-center">
                    <main className="col-12 col-lg-6 col-xl-5 main-content">
                      <ProfilePage currentProfile={currentProfile} />
                    </main>
                    <RightSidebar />
                  </div>
                </div>
              </>
            </ProtectedRoute>
          }
        />

        {/* Add redirect from old path to new path for backward compatibility */}
        <Route
          path="/user/:userId"
          element={
            <Navigate
              to={(location) => {
                const userId = location.pathname.split("/").pop();
                return `/profile/${userId}`;
              }}
              replace
            />
          }
        />

        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <>
                <Header
                  currentUser={currentUser}
                  currentProfile={currentProfile}
                  onLogout={handleLogout}
                />
                <div className="container-fluid p-0">
                  <div className="row g-0 justify-content-center">
                    <main className="col-12 col-lg-6 col-xl-5 main-content">
                      <ExplorePage currentProfile={currentProfile} />
                    </main>
                    <RightSidebar />
                  </div>
                </div>
              </>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </div>
  );
}
