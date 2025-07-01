import React, { useState } from "react";

export default function PostForm({ onAdd, currentUser }) {
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("general");
  const [img, setImg] = useState(null);

  function submit(e) {
    e.preventDefault();
    if (!body.trim()) return;
    onAdd({
      id: Date.now(),
      body,
      tag,
      imageName: img?.name || null,
    });
    setBody("");
    setTag("general");
    setImg(null);
  }

  const userInitial = currentUser ? currentUser.firstName[0].toUpperCase() : "?";

  return (
    <form onSubmit={submit} className="mb-4 p-3 post-card">
      <div className="d-flex">
        <div className="me-3">
          <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px", background: "#007bff", color: "#fff", fontSize: "1.4rem" }}>
            {userInitial}
          </div>
        </div>
        <div className="flex-grow-1">
          <textarea
            className="form-control mb-3"
            rows={3}
            maxLength={240}
            placeholder="What's on your mind?"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{ resize: "none", background: "var(--card)", color: "var(--text)" }}
          />
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="form-select form-select-sm me-3"
                style={{ width: "auto" }}
              >
                <option value="general">General</option>
                <option value="tech">Tech</option>
                <option value="life">Life</option>
                <option value="fun">Fun</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImg(e.target.files[0])}
                className="form-control form-control-sm"
                style={{ width: "auto" }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!body.trim()}>
              Post
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}