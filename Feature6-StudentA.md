# Feature6-StudentA.md

## Post Stream - Feature Implementation Summary

This document outlines the implementation of 4 key features in the Post Stream application built with React and Parse/Back4App backend.

## **Technology Stack**
- **Frontend**: React, React Router, Bootstrap5
- **Backend**: Parse Server (Back4App)
- **File Storage**: Parse File storage, Bytescale Upload Widget
- **Database**: Parse Database (NoSQL)

---

## **Feature 1: Password Reset Flow**

### **Implementation Overview**
Implemented a complete password reset flow using Parse's built-in authentication system.

### **Key Components**
- **Component**: `src/components/auth/AuthForgotPassword.jsx`
- **Service**: Uses Parse's native `Parse.User.requestPasswordReset()`

### **User Flow**
1. User clicks "Forgot Password?" on login page
2. Enters email address in reset form
3. Parse sends reset email automatically
4. User receives email with reset link
5. User clicks link and resets password via Parse's hosted page


### **Includes**
- ✅ Email validation
- ✅ Success/error feedback
- ✅ Automatic email delivery via Parse
- ✅ Secure token-based reset process

---

## **Feature 2: Like, Reply and Share Posts**

### **Implementation Overview**
Comprehensive social interaction system with likes, comments (replies), and retweets (shares).

### **Database Schema**

#### **Like Table**
- `postId` (String): Reference to post
- `userId` (String): Reference to Parse User
- `username` (String): Cached username

#### **Retweet Table**
- `postId` (String): Reference to original post
- `userId` (String): Reference to Parse User
- `username` (String): Cached username

#### **Post Table Extensions**
- `likesCount` (Number): Cached like count
- `commentsCount` (Number): Cached comment count
- `retweetsCount` (Number): Cached retweet count
- `isRetweet` (Boolean): Whether this is a retweet
- `originalPostId` (String): Reference to original post (for retweets)
- `originalPost` (Pointer): Parse pointer to original post
- `retweetedBy` (String): Profile ID of retweeter
- `retweetedByUsername` (String): Username of retweeter

### **Key Services**

#### **Likes Service** (`src/services/likes.js`)
```javascript
// Like/unlike functionality
export const likePost = async (postId, userId, username) => {
  // Create Like record
  // Increment post likesCount
};

export const unlikePost = async (postId, userId) => {
  // Delete Like record
  // Decrement post likesCount
};

export const isPostLiked = async (postId, userId) => {
  // Check if user has liked the post
};
```

#### **Retweets Service** (`src/services/retweets.js`)
```javascript
// Retweet/unretweet functionality
export const retweetPost = async (postId, profileId, username) => {
  // Create Retweet record
  // Create new Post with isRetweet=true
  // Set originalPost pointer
  // Increment original post retweetsCount
};
```

#### **Comments Service** (`src/services/comments.js`)
- Full CRUD operations for post replies
- Author profile integration

### **UI Components**

#### **PostActionBar** (`src/components/posts/PostActionBar.jsx`)
- Like button with heart icon and count
- Comment button with count
- Retweet button with share icon and count
- Real-time state updates

#### **RetweetedPost** (`src/components/posts/RetweetedPost.jsx`)
- Special component for displaying retweets
- Shows "User retweeted" header
- Displays original post content with original author info
- Maintains all interaction capabilities

### **Includes**
- ✅ Like/unlike posts with real-time count updates
- ✅ Comment/reply to posts with threaded display
- ✅ Retweet/share posts with proper attribution
- ✅ Optimistic UI updates
- ✅ Error handling and rollback on failures

---

## **Feature 3: Single Image Upload to Posts**

### **Implementation Overview**
Integrated image upload functionality using Bytescale Upload Widget with Parse File storage.

### **Key Components**
- **Upload Widget**: `@bytescale/upload-widget-react`
- **Post Form**: `src/components/posts/PostForm.jsx`
- **Service**: `src/services/posts.js`

### **Technical Implementation**

#### **Upload Configuration**
```javascript
const uploadOptions = {
  apiKey: "free", // Bytescale free tier
  maxFileCount: 1,
  mimeTypes: ["image/*"],
  multi: false,
  showFinishButton: false,
  styles: {
    colors: {
      primary: "#1DA1F2" // Twitter blue theme
    }
  }
};
```

#### **File Processing**
```javascript
// Clean filename generation
const generateCleanFilename = (originalFile) => {
  const timestamp = Date.now();
  const uuid = generateUUID();
  const extension = getFileExtension(originalFile.name);
  return `post_${timestamp}_${uuid}${extension}`;
};

// Parse File creation
const parseFile = new Parse.File(cleanFilename, imageFile);
await parseFile.save();
```

### **Post Model Extensions**
- `image` (File): Parse File object for backend storage
- `imageUrl` (String): Direct URL for frontend display

### **User Experience**
- ✅ Drag & drop image upload
- ✅ Image preview before posting
- ✅ Remove image option
- ✅ Support for JPEG, PNG, GIF formats
- ✅ Automatic image optimization
- ✅ Clean filename generation (timestamp + UUID)

### **Display Features**
- ✅ Responsive image display in posts
- ✅ Click to view full size
- ✅ Proper aspect ratio maintenance
- ✅ Loading states during upload

---

## **Feature 4: Profile Avatar Upload/Remove**

### **Implementation Overview**
Complete profile photo management system with upload, display, and removal capabilities.

### **Database Schema**
#### **Profile Table Extensions**
- `avatar` (String): URL to profile photo

### **Key Services**

#### **Profile Service** (`src/services/profiles.js`)
```javascript
// Avatar upload
export const updateProfileAvatar = async (profileId, imageFile) => {
  // Generate clean filename
  // Create Parse File
  // Update profile.avatar with URL
  // Return updated profile
};

// Avatar removal
export const removeProfileAvatar = async (profileId) => {
  // Remove avatar field from profile
  // Return updated profile
};
```

### **UI Components**

#### **ProfilePhotoUpload** (`src/components/profile/ProfilePhotoUpload.jsx`)
- File upload interface
- Image preview
- Upload/remove buttons
- Progress feedback
- Error handling

#### **Avatar Component** (`src/components/shared/Avatar.jsx`)
```javascript
// Reusable avatar display component
const Avatar = ({ profile, size = 40, className = "" }) => {
  // Show profile photo if available
  // Fallback to initials if no photo
  // Consistent styling across app
};
```

### **Integration Points**
The Avatar component is used throughout the application:
- ✅ **Post creation form** - Shows logged-in user's avatar
- ✅ **Post items** - Shows post author's avatar
- ✅ **Comments** - Shows commenter's avatar
- ✅ **Profile pages** - Shows profile owner's avatar
- ✅ **Header/sidebar** - Shows current user's avatar
- ✅ **Retweets** - Shows both retweeter and original author avatars

### **File Handling**
```javascript
// Clean filename for avatars
const generateAvatarFilename = (originalFile) => {
  const timestamp = Date.now();
  const uuid = generateUUID();
  const extension = getFileExtension(originalFile.name);
  return `avatar_${timestamp}_${uuid}${extension}`;
};
```

### **Includes**
- ✅ Upload profile photos via drag & drop or click
- ✅ Real-time preview before saving
- ✅ Remove existing profile photos
- ✅ Automatic image optimization
- ✅ Fallback to user initials when no photo
- ✅ Consistent avatar display across entire app
- ✅ File validation and error handling

---

## **Database Utilities**

### **Cleanup Script** (`src/utils/cleanDatabase.js`)
Comprehensive database reset utility that removes all data in proper dependency order:
1. Likes
2. Retweets
3. Comments
4. Follow relationships
5. Posts
6. Profiles
7. Parse Users

### **Seed Script** (`src/utils/seedData.js`)
Comprehensive data seeding with realistic sample data:
- 3 sample users with profiles
- 5 original posts
- Follow relationships between users
- Sample comments, likes, and retweets
- Proper data relationships and counts

### **Usage**
```bash
# Clean database
node src/utils/cleanDatabase.js

# Seed fresh data
node src/utils/seedData.js
```

---

## ✅ **Testing & Validation**

All features have been thoroughly tested with:
- Manual testing across different user scenarios
- Database cleanup and seeding scripts
- Error case handling
- Didn't test Cross-browser compatibility and Mobile responsiveness


Author: Showkot Hossain
Email: shossain@nd.edu