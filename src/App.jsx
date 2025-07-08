import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Remove BrowserRouter import

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

import { fetchPostsWithAuthor, createPost } from "./services/posts";
import { getCurrentUser } from "./components/auth/AuthService";

export default function App() {
  // State for all posts loaded from backend
  const [posts, setPosts] = useState(null);
  // State for the currently logged-in user via Parse
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and fetch posts
    const initializeApp = async () => {
      try {
        const user = getCurrentUser();
        setCurrentUser(user);
        
        if (user) {
          // Only fetch posts if user is authenticated
          const postsData = await fetchPostsWithAuthor();
          setPosts(postsData);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeApp();
  }, []);

  // Handler to add a new post (called from PostForm)
  const handleAdd = async (raw) => {
    // TODO: Add image upload support in future
    const saved = await createPost({
      ...raw,
      userId: currentUser?.id || "user1",
      user: currentUser,
    });
    setPosts([saved, ...(posts ?? [])]);
  };

  // Show loading spinner while initializing
  if (loading) return <Spinner />;

  return (
    <div className="app">
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/auth" element={<AuthModule />} />
        <Route path="/login" element={<AuthLogin />} />
        <Route path="/register" element={<AuthRegister />} />
        
        {/* Protected App Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <>
              {/* Header contains logo, navigation, and logout */}
              <Header currentUser={currentUser} />
              
              <div className="container-fluid p-0">
                <div className="row g-0 justify-content-center">
                  {/* Main Content: Timeline, PostPage, ProfilePage, ExplorePage */}
                  <main className="col-12 col-lg-6 col-xl-5 main-content">
                    <Timeline
                      posts={posts}
                      onAdd={handleAdd}
                      currentUser={currentUser}
                    />
                  </main>
                  
                  {/* Right Sidebar: trending, suggestions, etc. */}
                  <RightSidebar />
                </div>
              </div>
            </>
          </ProtectedRoute>
        } />
        
        <Route path="/post/:id" element={
          <ProtectedRoute>
            <>
              <Header currentUser={currentUser} />
              <div className="container-fluid p-0">
                <div className="row g-0 justify-content-center">
                  <main className="col-12 col-lg-6 col-xl-5 main-content">
                    <PostPage />
                  </main>
                  <RightSidebar />
                </div>
              </div>
            </>
          </ProtectedRoute>
        } />
        
        <Route path="/user/:userId" element={
          <ProtectedRoute>
            <>
              <Header currentUser={currentUser} />
              <div className="container-fluid p-0">
                <div className="row g-0 justify-content-center">
                  <main className="col-12 col-lg-6 col-xl-5 main-content">
                    <ProfilePage />
                  </main>
                  <RightSidebar />
                </div>
              </div>
            </>
          </ProtectedRoute>
        } />
        
        <Route path="/explore" element={
          <ProtectedRoute>
            <>
              <Header currentUser={currentUser} />
              <div className="container-fluid p-0">
                <div className="row g-0 justify-content-center">
                  <main className="col-12 col-lg-6 col-xl-5 main-content">
                    <ExplorePage />
                  </main>
                  <RightSidebar />
                </div>
              </div>
            </>
          </ProtectedRoute>
        } />
        
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </div>
  );
}