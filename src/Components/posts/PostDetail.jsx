import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostsWithAuthor } from "../../services/posts";
import { fetchCommentsByPost } from "../../services/comments";
import Spinner from "../shared/Spinner";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [coms, setComs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Post Details - Post Stream";
    setLoading(true);
    setError(null);

    Promise.all([fetchPostsWithAuthor(), fetchCommentsByPost(id)])
      .then(([posts, comments]) => {
        const foundPost = posts.find((p) => p.id === id);
        if (!foundPost) {
          setError(`Post with ID ${id} not found`);
          return;
        }
        setPost(foundPost);
        setComs(comments);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load post data");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!post) return <div className="alert alert-warning">Post not found</div>;

  return (
    <article className="p-3">
      <button className="btn btn-link mb-3" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>{post.user?.firstName} {post.user?.lastName}</h2>
      <p>{post.body}</p>
      <hr />
      <h3>Comments ({coms?.length || 0})</h3>
      <ul className="list-unstyled">
        {coms && coms.map((c) => (
          <li key={c.id} className="mb-2">{c.body}</li>
        ))}
      </ul>
    </article>
  );
}