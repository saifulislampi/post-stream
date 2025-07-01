import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Spinner from "./components/shared/Spinner";

import Timeline from "./pages/Timeline";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";

import { fetchPostsWithAuthor, createPost } from "./services/posts";
import { fetchFirstUser } from "./services/users";
import ExplorePage from "./pages/ExplorePage";

export default function App() {
  const [posts, setPosts] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    localStorage.removeItem("currentUserId");
    fetchPostsWithAuthor().then(setPosts);
    fetchFirstUser().then(user => {
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

  const handleSearch = (term) => setSearchTerm(term);

  // Filter posts based on search term
  const filteredPosts = posts
    ? posts.filter((post) => {
        if (!searchTerm.trim()) return true;
        const searchLower = searchTerm.toLowerCase().trim();
        return (
          post.body.toLowerCase().includes(searchLower) ||
          post.tag.toLowerCase().includes(searchLower) ||
          (post.user &&
            (`${post.user.firstName} ${post.user.lastName}`.toLowerCase().includes(searchLower)))
        );
      })
    : null;

  if (!posts) return <Spinner />;

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar column */}
        <div className="d-none d-md-block col-md-3 col-lg-2 px-0">
          <Header currentUser={currentUser} />
        </div>
        {/* Main content */}
        <main className="col-12 col-md-9 col-lg-7 main-content">
          <div className="container-main">
            <Routes>
              <Route
                path="/"
                element={<Timeline posts={filteredPosts} onAdd={handleAdd} searchTerm={searchTerm.trim()} totalPosts={posts?.length} onSearch={handleSearch} currentUser={currentUser} />}
              />
              <Route path="/post/:id" element={<PostPage />} />
              <Route path="/user/:userId" element={<ProfilePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
        {/* Optional empty right column */}
        <div className="d-none d-lg-block col-lg-3"></div>
      </div>
      <Footer />
    </div>
  );
}