import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { fetchPostsWithAuthor } from "../../services/posts";
import { fetchCommentsByPost } from "../../services/comments";
import Spinner from "../shared/Spinner";

export default function PostDetail() {
  const { id }   = useParams();      // ← route param
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [coms, setComs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* fetch post + comments whenever :id changes */
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    Promise.all([
      fetchPostsWithAuthor(),
      fetchCommentsByPost(id)
    ])
    .then(([posts, comments]) => {
      const foundPost = posts.find(p => p.id === id);
      
      if (!foundPost) {
        setError(`Post with ID ${id} not found`);
        return;
      }
      
      setPost(foundPost);
      setComs(comments);
    })
    .catch(err => {
      console.error('PostDetail: Error fetching data:', err);
      setError('Failed to load post data');
    })
    .finally(() => {
      setLoading(false);
    });
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <article>
      <button onClick={() => navigate(-1)}>← Back</button>

      <h2>
        {post.user?.firstName} {post.user?.lastName}
      </h2>
      <p>{post.body}</p>

      <hr />

      <h3>Comments ({coms?.length || 0})</h3>
      <ul>
        {coms && coms.map(c => (
          <li key={c.id}>{c.body}</li>
        ))}
      </ul>
    </article>
  );
}
