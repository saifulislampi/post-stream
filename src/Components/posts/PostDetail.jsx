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

  /* fetch post + comments whenever :id changes */
  useEffect(() => {
    fetchPostsWithAuthor().then(ps =>
      setPost(ps.find(p => p.id === +id))
    );
    fetchCommentsByPost(id).then(setComs);
  }, [id]);

  if (!post || !coms) return <Spinner />;

  return (
    <article>
      <button onClick={() => navigate(-1)}>← Back</button>

      <h2>
        {post.user.firstName} {post.user.lastName}
      </h2>
      <p>{post.body}</p>

      <hr />

      <h3>Comments ({coms.length})</h3>
      <ul>
        {coms.map(c => (
          <li key={c.id}>{c.body}</li>
        ))}
      </ul>
    </article>
  );
}
