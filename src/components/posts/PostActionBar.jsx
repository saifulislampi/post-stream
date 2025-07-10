import React from "react";

export default function PostActionBar({ onLove, onRepost, onQuote }) {
  return (
    <div className="d-flex justify-content-around border-top pt-2 mt-2">
      <button
        className="btn btn-link text-muted p-0"
        title="Reply"
        onClick={onQuote}
      >
        <i className="bi bi-chat" style={{ fontSize: "1.2rem" }}></i>
      </button>
      <button
        className="btn btn-link text-muted p-0"
        title="Repost"
        onClick={onRepost}
      >
        <i className="bi bi-arrow-repeat" style={{ fontSize: "1.2rem" }}></i>
      </button>
      <button
        className="btn btn-link text-muted p-0"
        title="Love"
        onClick={onLove}
      >
        <i className="bi bi-heart" style={{ fontSize: "1.2rem" }}></i>
      </button>
    </div>
  );
}
