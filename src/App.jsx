import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/layout/Header";
import RightSidebar from "./components/layout/RightSidebar";
import Spinner from "./components/shared/Spinner";

import Timeline from "./pages/Timeline";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import ExplorePage from "./pages/ExplorePage";

import { fetchPostsWithAuthor, createPost } from "./services/PostService";
import { fetchFirstUser } from "./services/UserService";

export default function App() {
  // State for all posts loaded from backend
  const [posts, setPosts] = useState(null);
  // State for the currently logged-in user
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // TODO: In production, don't clear currentUserId on every reload
    localStorage.removeItem("currentUserId");
    // Fetch all posts from backend
    fetchPostsWithAuthor().then(setPosts);
    // Fetch the first user as the current user (for demo)
    fetchFirstUser().then((user) => {
      if (user) {
        localStorage.setItem("currentUserId", user.id);
        setCurrentUser(user);
      }
    });
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

  // TODO: Add global search/filter state if needed for Explore
  if (!posts) return <Spinner />; // Show loading spinner while posts load

  return (
    <div className="app">
      {/* Header contains logo and navigation */}
      <Header currentUser={currentUser} />

      <div className="container-fluid p-0">
        <div className="row g-0 justify-content-center">
          {/* Main Content: Timeline, PostPage, ProfilePage, ExplorePage */}
          <main className="col-12 col-lg-6 col-xl-5 main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <Timeline
                    posts={posts}
                    onAdd={handleAdd}
                    currentUser={currentUser}
                  />
                }
              />
              {/* TODO: Add route guards for private routes in future */}
              <Route path="/post/:id" element={<PostPage />} />
              <Route path="/user/:userId" element={<ProfilePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Right Sidebar: trending, suggestions, etc. */}
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
