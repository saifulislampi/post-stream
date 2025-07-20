import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostList from "../components/posts/PostList";
import SearchInput from "../components/shared/SearchInput";
import SearchAutocomplete from "../components/shared/SearchAutocomplete.jsx";
import SearchResults from "../components/shared/SearchResults.jsx";
import Spinner from "../components/shared/Spinner";
import { fetchPostsWithAuthor } from "../services/posts";
import { searchHashtags } from "../services/hashtags.js";
import { searchProfiles } from "../services/profiles";
// import { searchPosts } from "../services/postsSearch"; // not needed, use in-memory filter

// Number of posts per page for Explore
const PAGE_SIZE = 20;
export default function ExplorePage() {
  const navigate = useNavigate();
  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({ posts: [], users: [], hashtags: [] });
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  // Delay before hiding autocomplete dropdown (ms)
  const AUTOCOMPLETE_HIDE_DELAY_MS = 200;
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

  // Simple handler to update search term
  const handleSearch = (term) => {
    setSearchTerm(term);
    setShowAutocomplete(true);
  };

  // Handle search logic when searchTerm changes
  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim()) {
        setPosts(allPosts);
        setSearchResults({ posts: [], users: [], hashtags: [] });
        setSearching(false);
        return;
      }
      
      // For plain-text terms shorter than 3 chars, reset to full feed
      if (!searchTerm.startsWith("#") && !searchTerm.startsWith("@") && searchTerm.trim().length < 3) {
        setPosts(allPosts);
        setSearchResults({ posts: [], users: [], hashtags: [] });
        setSearching(false);
        return;
      }
      
      // Hashtag or user prefix: autocomplete will handle navigation
      if (searchTerm.startsWith("#") || searchTerm.startsWith("@")) {
        setSearching(false);
        return;
      }

      // Plain text: search posts, users, and hashtags
      setSearching(true);
      try {
        const low = searchTerm.toLowerCase().trim();
        // Filter posts client-side
        const pRes = allPosts.filter(post => {
          return (
            post.body.toLowerCase().includes(low) ||
            (post.tag && post.tag.toLowerCase().includes(low)) ||
            (post.author && `${post.author.firstName} ${post.author.lastName}`.toLowerCase().includes(low)) ||
            (post.hashtags && post.hashtags.some(h => h.toLowerCase().includes(low)))
          );
        });
        const [uRes, hRes] = await Promise.all([
          searchProfiles(searchTerm),
          searchHashtags(searchTerm, 10)
        ]);
        setSearchResults({ posts: pRes, users: uRes, hashtags: hRes });
        setPosts(pRes);
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    };

    performSearch();
  }, [searchTerm, allPosts]);

  if (loading) return <Spinner />;

  return (
    <div className="explore-page">
      <div className="explore-header mb-4" style={{ padding: "1rem", position: "relative" }}>
        <h1 className="h3 fw-bold mb-3">Explore</h1>
        <div style={{ position: "relative" }}>
          <SearchInput
            onSearch={handleSearch}
            placeholder="Search posts, users, or hashtags..."
            onFocus={() => setShowAutocomplete(true)}
            onBlur={() => setTimeout(() => setShowAutocomplete(false), AUTOCOMPLETE_HIDE_DELAY_MS)}
          />
          {showAutocomplete && searchTerm.startsWith("#") && (
            <SearchAutocomplete
              searchTerm={searchTerm}
              onHashtagSelect={(tag) => navigate(`/hashtag/${tag}`)}
              onUserSelect={() => {}}
            />
          )}
          {showAutocomplete && searchTerm.startsWith("@") && (
            <SearchAutocomplete
              searchTerm={searchTerm}
              onHashtagSelect={() => {}}
              onUserSelect={(user) => navigate(`/profile/${user.id}`)}
            />
          )}
        </div>
      </div>

      {searchTerm && searching ? (
        <div className="text-center py-4">
          <Spinner />
        </div>
      ) : searchTerm && !searchTerm.startsWith("#") && !searchTerm.startsWith("@") && searchTerm.trim().length >= 3 ? (
        <SearchResults
          posts={searchResults.posts}
          users={searchResults.users}
          hashtags={searchResults.hashtags}
          searchTerm={searchTerm}
        />
      ) : (
        <>
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
                  if (!searchTerm.trim()) setPosts(prev => [...prev, ...more]);
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
