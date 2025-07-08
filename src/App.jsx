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
import { fetchProfileByUserId } from "./services/profiles";

export default function App() {
  // State for all posts loaded from backend
  const [posts, setPosts] = useState(null);
  // State for the currently logged-in user via Parse
  const [currentUser, setCurrentUser] = useState(null);
  // Add state for current profile
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and fetch posts
    const initializeApp = async () => {
      try {
        const user = getCurrentUser();
        setCurrentUser(user);
        
        if (user) {
          // Fetch user's profile
          try {
            const profile = await fetchProfileByUserId(user.id);
            setCurrentProfile(profile);
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
          
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
    if (!currentProfile) return;
    
    try {
      const saved = await createPost(
        {
          ...raw,
          tag: raw.tag || 'general'
        }, 
        currentProfile
      );
      setPosts([saved, ...(posts ?? [])]);
    } catch (error) {
      console.error('Error creating post:', error);
    }
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
              {/* Pass both user and profile */}
              <Header currentUser={currentUser} currentProfile={currentProfile} />
              
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
        } />
        
        <Route path="/post/:id" element={
          <ProtectedRoute>
            <>
              <Header currentUser={currentUser} currentProfile={currentProfile} />
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
        } />
        
        {/* Change from /user/:userId to /profile/:profileId */}
        <Route path="/profile/:profileId" element={
          <ProtectedRoute>
            <>
              <Header currentUser={currentUser} currentProfile={currentProfile} />
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
        } />
        
        {/* Add redirect from old path to new path for backward compatibility */}
        <Route path="/user/:userId" element={
          <Navigate to={(location) => {
            const userId = location.pathname.split('/').pop();
            return `/profile/${userId}`;
          }} replace />
        } />
        
        <Route path="/explore" element={
          <ProtectedRoute>
            <>
              <Header currentUser={currentUser} currentProfile={currentProfile} />
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
        } />
        
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </div>
  );
}