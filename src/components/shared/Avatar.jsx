import React from "react";

// Helper function to get user initials
const getInitials = (profile) => {
  if (!profile) return "?";
  if (profile.firstName && profile.lastName) {
    return (
      profile.firstName[0].toUpperCase() + profile.lastName[0].toUpperCase()
    );
  }
  if (profile.firstName) return profile.firstName[0].toUpperCase();
  if (profile.lastName) return profile.lastName[0].toUpperCase();
  return "?";
};

export default function Avatar({ 
  profile, 
  size = 48, 
  fontSize = "1.2rem", 
  className = "",
  showOnlineStatus = false 
}) {
  const baseClasses = `profile-avatar d-flex align-items-center justify-content-center ${className}`;
  
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: fontSize,
    position: 'relative'
  };

  return (
    <div className={baseClasses} style={style}>
      {profile?.avatar ? (
        <img
          src={profile.avatar}
          alt={`${profile.firstName || 'User'}'s avatar`}
          className="w-100 h-100 rounded-circle object-fit-cover"
          style={{ objectFit: 'cover' }}
        />
      ) : (
        getInitials(profile)
      )}
      
      {showOnlineStatus && (
        <div 
          className="position-absolute bg-success rounded-circle border border-white"
          style={{
            width: '12px',
            height: '12px',
            bottom: '2px',
            right: '2px'
          }}
        />
      )}
    </div>
  );
}
