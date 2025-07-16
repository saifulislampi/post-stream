import React, { useState } from "react";
import { UploadButton } from "@bytescale/upload-widget-react";

export default function PostForm({ onAdd, currentUser }) {
  const [body, setBody] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);

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

  function submit(e) {
    e.preventDefault();
    // Allow posting if there's either text or an image
    if (!body.trim() && !uploadedImage) return;
    onAdd({
      id: Date.now(),
      body,
      tag: "general", // Default tag, we'll add hashtag parsing later
      image: uploadedImage ? uploadedImage.originalFile.file : null, // Pass the actual File object
      imageUrl: uploadedImage ? uploadedImage.fileUrl : null, // Pass the hosted URL
    });
    setBody("");
    setUploadedImage(null);
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

  // Fix: Handle Parse User object and potential undefined values
  const getUserInitial = () => {
    if (!currentUser) return "?";

    // For Parse User, access firstName using .get() method
    const firstName = currentUser.get
      ? currentUser.get("firstName")
      : currentUser.firstName;
    return firstName ? firstName[0].toUpperCase() : "?";
  };

  const userInitial = getUserInitial();
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
