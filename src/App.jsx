import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Spinner from "./components/shared/Spinner";

import Timeline from "./pages/Timeline";
import PostPage from "./pages/PostPage";

import { fetchPostsWithAuthor, createPost } from "./services/posts";
import { fetchFirstUser } from "./services/users";

export default function App() {
  const [posts, setPosts] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null); // For future auth context
  const nav = useNavigate();

  /* initial load */
  useEffect(() => {
    fetchPostsWithAuthor().then(setPosts);
    fetchFirstUser().then(setCurrentUser);
  }, []);

  const handleAdd = async raw => {
    const saved = await createPost({
      ...raw,
      userId: currentUser?.id || "user1", // Use current user or default for testing
      user: currentUser // Include user data for display
    });
    setPosts([saved, ...(posts ?? [])]);
  };

  const handleSearch = term => {
    setSearchTerm(term);
  };

  // Filter posts based on search term
  const filteredPosts = posts ? posts.filter(post => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase().trim();
    return (
      post.body.toLowerCase().includes(searchLower) ||
      post.tag.toLowerCase().includes(searchLower) ||
      (post.user && 
        (`${post.user.firstName} ${post.user.lastName}`.toLowerCase().includes(searchLower) ||
         post.user.firstName.toLowerCase().includes(searchLower) ||
         post.user.lastName.toLowerCase().includes(searchLower)))
    );
  }) : null;

  if (!posts) return <Spinner />;

  return (
    <>
      <Header onHome={() => nav("/")} onSearch={handleSearch} />

      <main className="container">
        <Routes>
          <Route
            path="/"
            element={
              <Timeline 
                posts={filteredPosts} 
                onAdd={handleAdd} 
                searchTerm={searchTerm.trim()}
                totalPosts={posts?.length}
              />
            }
          />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
