import React from "react";

/* TODO: add counters, optimistic update */
export default function PostActionBar({ onLove, onRepost, onQuote }) {
  return (
    <div className="actions">
      <button title="Love"   onClick={onLove}>♥ Love</button>
      <button title="Repost" onClick={onRepost}>↻ Repost</button>
      <button title="Quote"  onClick={onQuote}>✎ Quote</button>
    </div>
  );
}