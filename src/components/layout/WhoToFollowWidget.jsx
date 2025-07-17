import React from "react";
import SubtleInfoText from "../shared/SubtleInfoText";

const suggestedUsers = [
  {
    id: 1,
    name: "John Smith",
    handle: "johnsmith",
    avatar: "JS",
  },
  {
    id: 2,
    name: "Alice Johnson",
    handle: "alicej",
    avatar: "AJ",
  },
  {
    id: 3,
    name: "Mike Chen",
    handle: "mikechen",
    avatar: "MC",
  },
];

export default function WhoToFollowWidget() {
  const handleFollow = (userId) => {
    // Implement follow functionality
  };

  return (
    <div className="widget">
      <div className="widget-header">
        <h5 className="widget-title">Who to follow</h5>
        <SubtleInfoText>(Preview UI - no real data)</SubtleInfoText>
      </div>
      <div className="widget-content">
        {suggestedUsers.map((user) => (
          <div key={user.id} className="widget-item">
            <div className="suggestion-item">
              <div className="suggestion-info">
                <div className="suggestion-avatar">{user.avatar}</div>
                <div className="suggestion-details">
                  <div className="suggestion-name">{user.name}</div>
                  <div className="suggestion-handle">@{user.handle}</div>
                </div>
              </div>
              <button
                className="follow-btn"
                onClick={() => handleFollow(user.id)}
              >
                Follow
              </button>
            </div>
          </div>
        ))}
        {/* <div className="widget-item">
          <a href="#" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.9rem" }}>
            Show more
          </a>
        </div> */}
      </div>
    </div>
  );
}
