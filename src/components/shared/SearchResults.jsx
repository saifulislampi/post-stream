import React from "react";
import { useNavigate } from "react-router-dom";
import PostList from "../posts/PostList";
import "./SearchResults.css";

export default function SearchResults({ posts, users, hashtags, searchTerm }) {
  const navigate = useNavigate();
  return (
    <div className="search-results-page">
      {posts && posts.length > 0 && (
        <section className="mb-4">
          <h2 className="h5">Posts</h2>
          <PostList posts={posts} />
        </section>
      )}
      {users && users.length > 0 && (
        <section className="mb-4">
          <h2 className="h5">Users</h2>
          <ul className="list-group">
            {users.map((u) => (
              <li
                key={u.id}
                className="list-group-item d-flex align-items-center"
                onClick={() => navigate(`/profile/${u.username}`)}
                style={{ cursor: 'pointer' }}
              >
                {u.avatar && <img src={u.avatar} alt="avatar" className="avatar-sm me-2" />}
                <div>
                  <strong>@{u.username}</strong>
                  <div className="text-muted small">{u.firstName} {u.lastName}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      {hashtags && hashtags.length > 0 && (
        <section className="mb-4">
          <h2 className="h5">Hashtags</h2>
          <ul className="list-group">
            {hashtags.map((h) => (
              <li
                key={h.name}
                className="list-group-item"
                onClick={() => navigate(`/hashtag/${h.name}`)}
                style={{ cursor: 'pointer' }}
              >
                <strong>#{h.name}</strong> <span className="text-muted">({h.count})</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {!((posts && posts.length) || (users && users.length) || (hashtags && hashtags.length)) && (
        <p>No results found for "{searchTerm}"</p>
      )}
    </div>
  );
}
