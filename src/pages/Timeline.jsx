import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostForm from "../components/posts/PostForm";
import PostList from "../components/posts/PostList";
import Spinner from "../components/shared/Spinner";
import { fetchFeedPostsWithAuthor } from "../services/posts";

// Note: No search input on homepage per requirements
// Number of posts fetched per page; adjust as needed or move to config
const PAGE_SIZE = 10;
export default function Timeline({ onAdd, currentUser, currentProfile }) {
  const [feedPosts, setFeedPosts] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (!currentProfile) return;
    const loadFeed = async () => {
      setLoadingFeed(true);
      
      // Fetch both feed posts and user's own posts in a single query
      const posts = await fetchFeedPostsWithAuthor(currentProfile.id, PAGE_SIZE, skip);
      
      if (skip === 0) {
        setFeedPosts(posts);
      } else {
        setFeedPosts(prev => [...prev, ...posts]);
      }
      
      setHasMore(posts.length === PAGE_SIZE);
      setLoadingFeed(false);
    };
    loadFeed();
  }, [currentProfile, skip]);

  const handleLoadMore = () => setSkip(prev => prev + PAGE_SIZE);

  // Scroll to bottom when new posts are appended
  useEffect(() => {
    if (skip > 0 && !loadingFeed) {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  }, [feedPosts, loadingFeed, skip]);

  return (
    <div className="container-main">
      <PostForm onAdd={onAdd} currentUser={currentUser} currentProfile={currentProfile} />

      {/* Feed Section */}
      {currentProfile && currentProfile.followingCount === 0 ? (
        <div className="text-center mt-5">
          <p>You are not currently following anyone.</p>
          <p>
            Follow some users or <Link to="/explore">explore</Link> trending posts.
          </p>
        </div>
      ) : loadingFeed ? (
        <Spinner />
      ) : (
        <>
          <PostList posts={feedPosts} />
          {hasMore && (
            <div className="text-center my-4">
              <button
                className="btn btn-primary px-4"
                style={{ minWidth: '160px' }}
                onClick={handleLoadMore}
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
