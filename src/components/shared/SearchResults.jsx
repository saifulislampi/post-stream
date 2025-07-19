import React from "react";
import { useNavigate } from "react-router-dom";
import PostList from "../posts/PostList";
import Avatar from "./Avatar";
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
          <div className="d-flex flex-wrap gap-3">
            {users.map((u) => {
              const fullName = u.firstName && u.lastName 
                ? `${u.firstName} ${u.lastName}` 
                : u.firstName || u.lastName || "Unknown User";
              
              return (
                <div
                  key={u.id}
                  className="user-thumbnail d-flex align-items-center p-3 border rounded bg-white"
                  onClick={() => navigate(`/profile/${u.username}`)}
                  style={{ cursor: 'pointer', minWidth: '200px', maxWidth: '300px' }}
                >
                  <Avatar profile={u} size={48} className="me-3" />
                  <div className="flex-grow-1">
                    <div className="fw-bold text-dark">{fullName}</div>
                    <div className="text-muted small">@{u.username}</div>
                  </div>
                </div>
              );
            })}
          </div>
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
