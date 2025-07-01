import React, { useState } from 'react';
import PostList from '../components/posts/PostList';
import SearchInput from '../components/shared/SearchInput'; 
import { fetchPostsWithAuthor } from '../services/posts';
import Spinner from '../components/shared/Spinner';

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);

  const handleSearch = async (term) => {
    setSearchTerm(term);
    setLoading(true);
    try {
      // Assuming fetchPostsWithAuthor accepts a search term and returns an object with posts and total
      const result = await fetchPostsWithAuthor(term);
      setPosts(result.posts || result);
      setTotalPosts(result.total || (result.posts ? result.posts.length : result.length));
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">Explore Posts</h1>
      <SearchInput onSearch={handleSearch} placeholder="Search posts..." />
      {loading ? (
        <Spinner />
      ) : (
        <PostList posts={posts} searchTerm={searchTerm} totalPosts={totalPosts} />
      )}
    </div>
  );
}