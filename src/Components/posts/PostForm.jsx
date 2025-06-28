import React, { useState } from "react";

/* ==========================================================================
   Post composer – textarea + tag selector + file picker
   Immediate   • basic maxLength counter • disable button if body empty
   Next-week   • tag suggestions / auto-complete • client-side image preview
   Good-to-have• drag-n-drop images, GIF picker
===========================================================================*/
export default function PostForm({ onAdd }) {
  const [body, setBody] = useState("");
  const [tag,  setTag]  = useState("general");
  const [img,  setImg]  = useState(null);

  function submit(e) {
    e.preventDefault();
    if (!body.trim()) return;
    onAdd({
      id:       Date.now(),
      body,
      tag,
      imageName: img?.name || null,
      userId:    1           // TODO: pull from auth context
    });
    setBody(""); setTag("general"); setImg(null);
  }

  return (
    <form onSubmit={submit} className="composer">
      <textarea
        rows={3}
        maxLength={240}
        placeholder="What’s happening?"
        value={body}
        onChange={e => setBody(e.target.value)}
      />

      <select value={tag} onChange={e => setTag(e.target.value)}>
        <option value="general">General</option>
        <option value="tech">Tech</option>
        <option value="life">Life</option>
        <option value="fun">Fun</option>
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={e => setImg(e.target.files[0])}
      />

      <button type="submit">Post</button>
    </form>
  );
}