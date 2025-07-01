import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Spinner from "./components/shared/Spinner";

import Timeline from "./pages/Timeline";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import ExplorePage from "./pages/ExplorePage";

import { fetchPostsWithAuthor, createPost } from "./services/posts";
import { fetchFirstUser } from "./services/users";

export default function App() {
  const [posts, setPosts] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

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
    <div className="app-container">
      <Header currentUser={currentUser} />
      
      <div className="main-content">
        <div className="content-wrapper">
          <Routes>
            <Route
              path="/"
              element={<Timeline posts={filteredPosts} onAdd={handleAdd} currentUser={currentUser} />}
            />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/user/:userId" element={<ProfilePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        
        {/* Right sidebar for desktop - trends, suggestions, etc. */}
        <aside className="right-sidebar d-none d-xl-block">
          <div className="trends-widget">
            <h5 className="widget-title">Trending</h5>
            <div className="trend-item">
              <div className="trend-category">Trending in Tech</div>
              <div className="trend-title">#React</div>
              <div className="trend-count">2,845 posts</div>
            </div>
            <div className="trend-item">
              <div className="trend-category">Trending</div>
              <div className="trend-title">#WebDev</div>
              <div className="trend-count">1,234 posts</div>
            </div>
            <div className="trend-item">
              <div className="trend-category">Trending in Life</div>
              <div className="trend-title">#MondayMotivation</div>
              <div className="trend-count">892 posts</div>
            </div>
          </div>
          
          <div className="suggestions-widget">
            <h5 className="widget-title">Who to follow</h5>
            <div className="suggestion-item">
              <div className="suggestion-avatar">JS</div>
              <div className="suggestion-info">
                <div className="suggestion-name">John Smith</div>
                <div className="suggestion-handle">@johnsmith</div>
              </div>
              <button className="btn btn-outline-primary btn-sm">Follow</button>
            </div>
            <div className="suggestion-item">
              <div className="suggestion-avatar">AD</div>
              <div className="suggestion-info">
                <div className="suggestion-name">Alice Doe</div>
                <div className="suggestion-handle">@alicedoe</div>
              </div>
              <button className="btn btn-outline-primary btn-sm">Follow</button>
            </div>
          </div>
        </aside>
      </div>
      
      <Footer />
    </div>
  );
}