import React, { useState, useEffect } from "react";
import PostList from "../components/posts/PostList";
import SearchInput from "../components/shared/SearchInput";
import { fetchPostsWithAuthor } from "../services/posts";
import Spinner from "../components/shared/Spinner";

export default function ExplorePage() {
  // TODO: Add debounce to search input for better UX
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Load all posts initially
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const result = await fetchPostsWithAuthor();
        setAllPosts(result);
        setPosts(result); // Show all posts initially
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
  }, []);

  const handleSearch = async (term) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      // If search is empty, show all posts
      setPosts(allPosts);
      setSearching(false);
      return;
    }

    setSearching(true);
    
    // Filter posts based on search term
    const filtered = allPosts.filter((post) => {
      const lowerTerm = term.toLowerCase().trim();
      return (
        post.body.toLowerCase().includes(lowerTerm) ||
        post.tag.toLowerCase().includes(lowerTerm) ||
        (post.user &&
          `${post.user.firstName} ${post.user.lastName}`
            .toLowerCase()
            .includes(lowerTerm))
      );
    });
    
    setPosts(filtered);
    setSearching(false);
  };

  if (loading) return <Spinner />;

  return (
    <div className="explore-page">
      <div className="explore-header mb-4" style={{ padding: "1rem" }}>
        <h1 className="h3 fw-bold mb-3">Explore</h1>
        <SearchInput
          onSearch={handleSearch}
          placeholder="Search posts, users, or hashtags..."
        />
      </div>
      
      {searching ? (
        <Spinner />
      ) : (
        <>
          {searchTerm && (
            <div className="search-results-header mb-3">
              <p className="text-muted">
                {posts.length > 0 
                  ? `Found ${posts.length} result${posts.length !== 1 ? 's' : ''} for "${searchTerm}"`
                  : `No results found for "${searchTerm}"`
                }
              </p>
            </div>
          )}
          <PostList posts={posts} />
        </>
      )}
    </div>
  );
}