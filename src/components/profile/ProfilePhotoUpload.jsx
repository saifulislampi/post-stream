import React, { useState } from "react";
import { updateProfileAvatar, removeProfileAvatar } from "../../services/profiles";

export default function ProfilePhotoUpload({ profile, onProfileUpdate }) {
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setShowModal(false);

    try {
      const updatedProfile = await updateProfileAvatar(profile.id, file);
      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      alert('Failed to upload profile photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    setShowModal(false);
    // Trigger the hidden file input
    document.getElementById('profile-photo-input').click();
  };

  const handleRemovePhoto = async () => {
    setShowModal(false);
    setIsUploading(true);

    try {
      const updatedProfile = await removeProfileAvatar(profile.id);
      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
    } catch (error) {
      console.error("Error removing profile photo:", error);
      alert('Failed to remove profile photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Upload button overlay on avatar */}
      <div className="profile-photo-upload-overlay" onClick={() => setShowModal(true)}>
        {isUploading ? (
          <div className="upload-spinner">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Uploading...</span>
            </div>
          </div>
        ) : (
          <div className="upload-icon">
            <i className="bi bi-camera-fill"></i>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        id="profile-photo-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={isUploading}
      />

      {/* Modal for upload options */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Profile Photo</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body p-0">
                <div className="list-group list-group-flush">
                  <button
                    type="button"
                    className="list-group-item list-group-item-action"
                    onClick={handleUploadClick}
                  >
                    <i className="bi bi-upload me-2"></i>
                    Upload Photo
                  </button>
                  {profile.avatar && (
                    <button
                      type="button"
                      className="list-group-item list-group-item-action text-danger"
                      onClick={handleRemovePhoto}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
