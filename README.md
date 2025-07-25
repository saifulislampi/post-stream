
# Post Stream

A modern micro-blogging application inspired by Twitter, built with React and Parse Server. Features real-time content discovery, social interactions, and dual-platform deployment.

Developed as a class project for CSE 40693 - Modern Web Development at Notre Dame.

---

## Quick Start

1. **Install and run:**
   ```bash
   npm install
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

2. **Demo account:**
   - **Username:** `janedoe` | **Password:** `password123`

*If you encounter Parse backend errors, see [Testing with Your Own Data](#testing-with-your-own-data) section.*

---

## Live Demo

You can try the live deployed demo here:
- **Primary**: [Netlify Deployment](https://spectacular-wisp-d472d3.netlify.app/)
- **Alternative**: [GitHub Pages Deployment](https://saifulislampi.github.io/post-stream/)

Use the demo account above to explore all features.

---

## Feature 6 Implementation Overview

This project showcases advanced feature implementation by two students:

### Student A: Core Social Features
**Showkot Hossain** implemented fundamental social interaction features:
- **Password Reset Flow** - Complete email-based password recovery
- **Post Interactions** - Like, reply, and share functionality with real-time updates
- **Image Upload** - Single image uploads to posts with file management
- **Profile Avatars** - Upload and manage profile photos

📄 **[Complete Student A Documentation →](Feature6-StudentA.md)**

### Student B: Advanced Features & Architecture  
**Md Saiful Islam** implemented advanced user experience and deployment features:
- **Personalized Timeline** - Smart follow detection with intelligent empty state handling
- **Multi-Modal Search System** - Hashtag, user, and text search with real-time autocomplete
- **Follow/Unfollow System** - Instant UI updates with optimistic rendering and error rollback
- **Bootstrap 5 Design System** - Professional responsive design with custom theme and components
- **Dual Platform Deployment** - Automated deployment to both [Netlify](https://spectacular-wisp-d472d3.netlify.app/) and [GitHub Pages](https://saifulislampi.github.io/post-stream/) with CI/CD
- **Hashtag System & Pages** - Dynamic routing and content aggregation for hashtag-based discovery
- **Additional Features** - Trending analytics, emoji integration, enhanced profile pages, and maintainable routing architecture

📄 **[Complete Student B Documentation →](Feature6-StudentB.md)**

---

## Overall Implemented Features

### ✅ **Authentication & Security**
- Complete user registration, login, logout system
- Password reset via email
- Protected routes and session management

### ✅ **Social Interactions**
- Create and view posts with image support
- Like, reply, and retweet functionality
- Follow/unfollow users with real-time updates
- Profile avatar upload and management

### ✅ **Content Discovery**  
- Personalized timeline based on follows
- Advanced search (hashtags, users, text)
- Trending hashtag analytics
- User recommendation system

### ✅ **User Experience**
- Professional Bootstrap 5 design system
- Emoji picker integration
- Responsive mobile-first layout
- Real-time UI updates with optimistic rendering

### ✅ **Advanced Features**
- Hashtag pages with content aggregation  
- Profile pages with content filtering
- Dual-platform deployment (Netlify + GitHub Pages)
- Configuration-based routing architecture

---

## Testing with Your Own Data

To set up your own Parse backend:

1. **Create a Back4App account:**
   - Sign up at [Back4App](https://www.back4app.com/)
   - Create a new app and get your credentials

2. **Configure the application:**
   - Update `src/environments.js` with your Application ID, Client Key, and Server URL

3. **Seed test data:**
   ```bash
   npm run seed
   ```

4. **Database structure:** User authentication, Profile data, Posts, Comments, Follows, Likes, Retweets

---

## Authentication & Deployment

- **Authentication**: Complete Parse-based auth system with protected routes
- **Deployment**: Automated dual-platform deployment to Netlify and GitHub Pages
- **Documentation**: See [AUTH_IMPLEMENTATION.md](AUTH_IMPLEMENTATION.md) and [DEPLOYMENT.md](DEPLOYMENT.md)

---

## Version History

See [CHANGELOG.md](./CHANGELOG.md) for release notes and development timeline.

---

## Team Members

- **Student A**: Showkot Hossain (shossain@nd.edu)
- **Student B**: Md Saiful Islam (mislam5@nd.edu)
