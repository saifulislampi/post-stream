import React, { useEffect, useState } from "react";
import { fetchCommentsByPost } from "../../services/comments";
import { fetchPostsWithAuthor } from "../../services/post";
import Spinner from "../shared/Spinner";

export default function PostDetail({ id, onBack }) {
  const [post, setPost] = useState(null);
  const [coms, setComs] = useState(null);

  useEffect(() => {
    fetchPostsWithAuthor().then(ps => setPost(ps.find(p => p.id === +id)));
    fetchCommentsByPost(id).then(setComs);
  }, [id]);

  if (!post || !coms) return <Spinner />;

  return (
    <article>
      <button onClick={onBack}>← Back</button>
      <h2>{post.user.firstName} {post.user.lastName}</h2>
      <p>{post.body}</p>
      <hr />
      <h3>Comments ({coms.length})</h3>
      <ul>
        {coms.map(c => <li key={c.id}>{c.body}</li>)}
      </ul>
    </article>
  );
}