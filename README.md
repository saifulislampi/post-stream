# Post Stream

Post Stream is a modern micro-blogging app inspired by Twitter, built with React and Back4App. Share short posts, follow users, and explore trending content in a clean, responsive interface.

This project was developed as a class project for [CSE 40693 - Modern Web Development](https://www.coursicle.com/nd/courses/CSE/40693/) at Notre Dame.

> **Note:** This repository follows instructions and requirements from the course instructor. Naming conventions and some code styles are therefore opinionated and may differ from typical production code.

## Features

### Backend Implemented
- Home page: view all posts from backend, create new post
- Explore page: search posts and users
- Profile page: follow/unfollow users, follower/following/post count
- Post detail page: view post and replies

### UI Only (No Backend Yet)
- Add image to post (UI only)
- Right panel: trending topics and follow suggestions
- Post actions: react, reply, quote (UI only)
- Profile page tabs: Replies, Media, Likes (UI only)
- Reply to posts (UI only)

## Getting Started

1. **Install dependencies:**
   ```
   npm install
   ```
2. **Set up Back4App:**
   - Create a free account at [Back4App](https://www.back4app.com/)
   - Create a new app and get your Application ID, Client Key, and Server URL
   - Update `src/environments.js` with your credentials
3. **Seed the database with test data:**
   ```
   npm run seed
   ```
4. **Start the development server:**
   ```
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Structure
- **AppUser**: `firstName`, `lastName`, `email`
- **Post**: `userId`, `body`, `imageName`
- **Comment**: `postId`, `userId`, `body`

## Scripts
- `npm install` – Install dependencies
- `npm run seed` – Seed Back4App with test data
- `npm start` – Start the development server
- `npm run build` – Build for production

---

For any issues or contributions, please open an issue or pull request.
