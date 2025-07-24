import React, { useState } from "react";
import { UploadButton } from "@bytescale/upload-widget-react";
import Avatar from "../shared/Avatar";
import Picker from 'emoji-picker-react';

export default function PostForm({ onAdd, currentUser, currentProfile }) {
  const [body, setBody] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Upload widget options
  const uploadOptions = {
    apiKey: "free", // Using free tier for development
    maxFileCount: 1,
    mimeTypes: ["image/*"],
    multi: false,
    showFinishButton: false,
    styles: {
      colors: {
        primary: "#1DA1F2" // Twitter blue
      }
    }
  };

  function extractHashtags(text, max = 10) {
  // Matches #word, ignores punctuation, case-insensitive
  const matches = text.match(/#\w+/g);
  if (!matches) return [];
  // Remove # and lowercase for consistency
  return matches.slice(0, max).map(tag => tag.replace('#', '').toLowerCase());
}

  function submit(e) {
    e.preventDefault();
    // Allow posting if there's either text or an image
    if (!body.trim() && !uploadedImage) return;
    const hashtags = extractHashtags(body, 10);
    onAdd({
      id: Date.now(),
      body,
      tag: "general",
      hashtags, // Pass up to 10 hashtags
      image: uploadedImage ? uploadedImage.originalFile.file : null,
      imageUrl: uploadedImage ? uploadedImage.fileUrl : null,
    });
    setBody("");
    setUploadedImage(null);
    // Notify listeners of new post
    console.log("Post submitted:", { body, hashtags });
    window.dispatchEvent(new Event('postCreated'));
  }

  // Handle image upload completion
  const handleImageUpload = (files) => {
    if (files && files.length > 0) {
      setUploadedImage(files[0]);
    }
  };

  // Handle image removal
  const handleImageRemove = () => {
    setUploadedImage(null);
  };

  // Handle emoji selection
  const onEmojiClick = (emojiData, event) => {
    setBody(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const charLimit = 280;
  const remainingChars = charLimit - body.length;

  return (
    <div className="post-form-container">
      <form onSubmit={submit} className="post-form">
        <div className="post-form-header">
          <Avatar profile={currentProfile} size={48} className="post-form-avatar" />
          <div className="form-content">
            <textarea
              className="post-textarea"
              placeholder="What's happening?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={charLimit}
              rows={3}
            />
            
            {/* Image preview */}
            {uploadedImage && (
              <div className="image-preview">
                <img 
                  src={uploadedImage.fileUrl} 
                  alt="Preview" 
                  className="preview-image"
                />
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={handleImageRemove}
                  title="Remove image"
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="post-form-footer">
          <div className="post-actions">
            <UploadButton
              options={uploadOptions}
              onComplete={handleImageUpload}
            >
              {({ onClick }) => (
                <button
                  type="button"
                  className="action-btn media-btn"
                  onClick={onClick}
                  title="Add photo"
                >
                  <i className="bi bi-image"></i>
                </button>
              )}
            </UploadButton>
            <button
              type="button"
              className="action-btn emoji-btn"
              title="Add emoji"
              onClick={() => setShowEmojiPicker(prev => !prev)}
            >
              <i className="bi bi-emoji-smile"></i>
            </button>
            {showEmojiPicker && (
              <div className="emoji-picker-container" style={{ position: 'absolute', zIndex: 1000 }}>
                <Picker onEmojiClick={onEmojiClick} />
              </div>
            )}
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
              disabled={(!body.trim() && !uploadedImage) || remainingChars < 0}
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
