import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostForm from "../components/posts/PostForm";
import PostList from "../components/posts/PostList";
import Spinner from "../components/shared/Spinner";
import { fetchFeedPostsWithAuthor, createPost } from "../services/posts";

// Note: No search input on homepage per requirements
// Number of posts fetched per page; adjust as needed or move to config
const PAGE_SIZE = 10;
export default function Timeline({ currentUser, currentProfile, feedRefreshCount }) {
  const [feedPosts, setFeedPosts] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Reload feed when profile, pagination, or external refresh trigger changes
  useEffect(() => {
    if (!currentProfile) return;
    console.log('Timeline: Loading feed, followingCount:', currentProfile.followingCount, 'feedRefreshCount:', feedRefreshCount);
    const loadFeed = async () => {
      try {
        setLoadingFeed(true);
        const posts = await fetchFeedPostsWithAuthor(
          currentProfile.id,
          PAGE_SIZE,
          skip
        );
        console.log('Timeline: Received posts:', posts.length);
        if (skip === 0) {
          setFeedPosts(posts);
        } else {
          setFeedPosts((prev) => [...prev, ...posts]);
        }
        setHasMore(posts.length === PAGE_SIZE);
      } catch (error) {
        console.error('Timeline: Error loading feed:', error);
        setFeedPosts([]);
        setHasMore(false);
      } finally {
        setLoadingFeed(false);
      }
    };
    loadFeed();
  }, [currentProfile, skip, feedRefreshCount]);

  // Reset pagination when feed refresh is triggered or following count changes
  useEffect(() => {
    if (feedRefreshCount > 0) {
      setSkip(0);
    }
  }, [feedRefreshCount]);

  const handleLoadMore = () => setSkip((prev) => prev + PAGE_SIZE);

  // Scroll to bottom when new posts are appended
  useEffect(() => {
    if (skip > 0 && !loadingFeed) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [feedPosts, loadingFeed, skip]);

  // Handler to add a new post
  const handleAddPost = async (raw) => {
    if (!currentProfile) return;

    try {
      const saved = await createPost(
        { ...raw, tag: raw.tag || "general" },
        currentProfile
      );

      const postWithAuthor = {
        ...saved,
        author: currentProfile,
      };

      setFeedPosts([postWithAuthor, ...(feedPosts ?? [])]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="container-main">
      <PostForm
        onAdd={handleAddPost}
        currentUser={currentUser}
        currentProfile={currentProfile}
      />

      {/* Feed Section */}
      {loadingFeed ? (
        <Spinner />
      ) : currentProfile && currentProfile.followingCount === 0 ? (
        <div className="text-center mt-5">
          <p>You are not currently following anyone.</p>
          <p>
            Follow some users or <Link to="/explore">explore</Link> trending
            posts.
          </p>
        </div>
      ) : (
        <>
          <PostList posts={feedPosts} />
          {hasMore && (
            <div className="text-center my-4">
              <button
                className="btn btn-primary px-4"
                style={{ minWidth: "160px" }}
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
