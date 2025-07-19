import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostsWithAuthor } from "../services/posts";
import Spinner from "../components/shared/Spinner";
import PostList from "../components/posts/PostList";

export default function HashtagPage() {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const allPosts = await fetchPostsWithAuthor();
      setPosts(allPosts.filter(
        p => (p.hashtags || []).map(h => h.toLowerCase()).includes(tag.toLowerCase())
      ));
      setLoading(false);
    }
    load();
  }, [tag]);

  if (loading) return <Spinner />;
  return (
    <div>
      <h2>#{tag}</h2>
      <PostList posts={posts} />
    </div>
  );
}