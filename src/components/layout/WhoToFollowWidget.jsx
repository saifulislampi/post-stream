import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SubtleInfoText from "../shared/SubtleInfoText";
import Spinner from "../shared/Spinner";
import { getTopPosters } from "../../services/profiles.js";

export default function WhoToFollowWidget({ currentProfile }) {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSuggestions = async () => {
      setLoading(true);
      try {
        const profiles = await getTopPosters(3);
        setSuggestedUsers(profiles);
      } catch (err) {
        console.error("Error loading top posters:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadSuggestions();
  }, []);


  // Loading state
  if (loading) {
    return (
      <div className="widget">
        <div className="widget-header">
          <h5 className="widget-title">Who to follow</h5>
        </div>
        <div className="widget-content" style={{ textAlign: 'center', padding: '1rem' }}>
          <Spinner />
        </div>
      </div>
    );
  }
  // Error state
  if (error) {
    return (
      <div className="widget">
        <div className="widget-header">
          <h5 className="widget-title">Who to follow</h5>
        </div>
        <div className="widget-content">
          <SubtleInfoText>(Unable to load suggestions)</SubtleInfoText>
        </div>
      </div>
    );
  }
  // Data loaded
  return (
    <div className="widget">
      <div className="widget-header">
        <h5 className="widget-title">Who to follow</h5>
      </div>
      <div className="widget-content">
        {suggestedUsers.map((user) => (
          <Link
            key={user.id}
            to={`/profile/${user.id}`}
            className="widget-item suggestion-link"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="suggestion-item">
              <div className="suggestion-info">
                <div className="suggestion-avatar">{user.firstName?.[0] || user.username?.[0]}</div>
                <div className="suggestion-details">
                  <div className="suggestion-name">{user.firstName} {user.lastName}</div>
                  <div className="suggestion-handle">@{user.username}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
