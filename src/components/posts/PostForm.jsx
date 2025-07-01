import React, { useState } from "react";

export default function PostForm({ onAdd, currentUser }) {
  const [body, setBody] = useState("");
  const [img, setImg] = useState(null);

  function submit(e) {
    e.preventDefault();
    if (!body.trim()) return;
    onAdd({
      id: Date.now(),
      body,
      tag: "general", // Default tag, we'll add hashtag parsing later
      imageName: img?.name || null,
    });
    setBody("");
    setImg(null);
  }

  const userInitial = currentUser ? currentUser.firstName[0].toUpperCase() : "?";
  const charLimit = 280;
  const remainingChars = charLimit - body.length;

  return (
    <div className="post-form-container">
      <form onSubmit={submit} className="post-form">
        <div className="post-form-header">
          <div className="user-avatar">{userInitial}</div>
          <div className="form-content">
            <textarea
              className="post-textarea"
              placeholder="What's happening?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={charLimit}
              rows={3}
            />
          </div>
        </div>

        <div className="post-form-footer">
          <div className="post-actions">
            <label className="action-btn media-btn" title="Add photo">
              <i className="bi bi-image"></i>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImg(e.target.files[0])}
                className="file-input"
              />
            </label>
            <button
              type="button"
              className="action-btn emoji-btn"
              title="Add emoji"
            >
              <i className="bi bi-emoji-smile"></i>
            </button>
          </div>

          <div className="post-submit">
            <div className="char-counter">
              <span
                className={
                  remainingChars < 20
                    ? "text-warning"
                    : remainingChars < 0
                    ? "text-danger"
                    : "text-muted"
                }
              >
                {remainingChars}
              </span>
            </div>
            <button
              type="submit"
              className="post-btn"
              disabled={!body.trim() || remainingChars < 0}
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}