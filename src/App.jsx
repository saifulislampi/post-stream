import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Spinner from "./components/shared/Spinner";

import Timeline from "./pages/Timeline";
import PostPage from "./pages/PostPage";

import { fetchPostsWithAuthor, createPost } from "./services/posts";

export default function App() {
  const [posts, setPosts] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const nav = useNavigate();

  /* initial load */
  useEffect(() => {
    fetchPostsWithAuthor().then(setPosts);
  }, []);

  const handleAdd = async raw => {
    const saved = await createPost({
      ...raw,
      user: { id: 1, firstName: "Jane", lastName: "Doe" } // TODO: auth ctx
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
