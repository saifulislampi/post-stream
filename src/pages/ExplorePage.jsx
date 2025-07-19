import React, { useState, useEffect } from "react";
import PostList from "../components/posts/PostList";
import SearchInput from "../components/shared/SearchInput";
import { fetchPostsWithAuthor } from "../services/posts";
import Spinner from "../components/shared/Spinner";

// Number of posts per page for Explore
const PAGE_SIZE = 20;
export default function ExplorePage() {
  // TODO: Add debounce to search input for better UX
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Load first page of posts initially
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const result = await fetchPostsWithAuthor(PAGE_SIZE, 0);
        setAllPosts(result);
        setPosts(result);
        setHasMore(result.length === PAGE_SIZE);
        setSkip(0);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // Scroll to bottom when new posts are appended
  useEffect(() => {
    if (skip > 0 && !loading) {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  }, [posts, loading, skip]);

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
        (post.author &&
          `${post.author.firstName} ${post.author.lastName}`
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
                  ? `Found ${posts.length} result${posts.length !== 1 ? "s" : ""} for "${searchTerm}"`
                  : `No results found for "${searchTerm}"`}
              </p>
            </div>
          )}
          <PostList posts={posts} />
          {hasMore && (
            <div className="text-center my-4">
              <button
                className="btn btn-primary px-4"
                style={{ minWidth: '160px' }}
                onClick={async () => {
                  setLoading(true);
                  const nextSkip = skip + PAGE_SIZE;
                  const more = await fetchPostsWithAuthor(PAGE_SIZE, nextSkip);
                  setAllPosts(prev => [...prev, ...more]);
                  if (!searchTerm.trim()) {
                    setPosts(prev => [...prev, ...more]);
                  }
                  setHasMore(more.length === PAGE_SIZE);
                  setSkip(nextSkip);
                  setLoading(false);
                }}
              >
                Load more posts
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
