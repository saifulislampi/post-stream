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
  const [posts, setPosts] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    localStorage.removeItem("currentUserId");
    fetchPostsWithAuthor().then(setPosts);
    fetchFirstUser().then((user) => {
      if (user) {
        localStorage.setItem("currentUserId", user.id);
        setCurrentUser(user);
      }
    });
  }, []);

  const handleAdd = async (raw) => {
    const saved = await createPost({
      ...raw,
      userId: currentUser?.id || "user1",
      user: currentUser,
    });
    setPosts([saved, ...(posts ?? [])]);
  };

  if (!posts) return <Spinner />;

  return (
    <div className="app">
      <Header currentUser={currentUser} />

      <div className="container-fluid p-0">
        <div className="row g-0 justify-content-center">
          {/* Main Content */}
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
              <Route path="/post/:id" element={<PostPage />} />
              <Route path="/user/:userId" element={<ProfilePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Right Sidebar */}
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
