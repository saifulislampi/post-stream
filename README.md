
# Post Stream

Post Stream is a modern micro-blogging app inspired by Twitter, built with React and Back4App (Parse). Share short posts, follow users, and explore trending content in a clean, responsive interface.

This project was developed as a class project for [CSE 40693 - Modern Web Development](https://www.coursicle.com/nd/courses/CSE/40693/) at Notre Dame.

---

## Features

### Core Features (with Backend)
- Home page: view all posts from backend, create new post
- Explore page: search posts and users
- Profile page: follow/unfollow users, follower/following/post count
- Post detail page: view post and replies
- Authentication: register, login, logout, protected routes
- User profiles: separate Profile class for public info and stats
- Route protection: only authenticated users can access main app

### UI Only (No Backend Yet)
- Add image to post (UI only)
- Right panel: trending topics and follow suggestions (UI only)
- Post actions: react, reply, quote (UI only)
- Profile page tabs: Replies, Media, Likes (UI only)
- Reply to posts (UI only)

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up Back4App:**
   - Create a free account at [Back4App](https://www.back4app.com/)
   - Create a new app and get your Application ID, Client Key, and Server URL
   - Update `src/environments.js` with your credentials
3. **Seed the database with test data:**
   *(Only needed if starting from a clean database or after changing your Back4App/Parse APPLICATION_ID)*
   ```bash
   npm run seed
   ```
4. **Start the development server:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Structure

- **User (Parse.User):** Handles authentication (username, email, password, session)
- **Profile:** Public user info, stats, referenced by posts/comments
- **Post:** `authorId` (Profile), `body`, `tag`, `createdAt`, `commentsCount`, `likesCount`
- **Comment:** `postId`, `authorId` (Profile), `body`, `createdAt`
- **Follow:** `followerId` (Profile), `followingId` (Profile)

---

## Scripts
- `npm install` – Install dependencies
- `npm run seed` – Seed Back4App with test data
- `npm start` – Start the development server
- `npm run build` – Build for production

---

## Authentication & Protected Routes

- Full authentication system (register, login, logout) using Parse
- ProtectedRoute and UnauthenticatedRoute components for route access control
- Only authenticated users can access main app routes
- Auth pages (login/register) are inaccessible when already logged in
- See [AUTH_IMPLEMENTATION.md](./AUTH_IMPLEMENTATION.md) for details

---


See [CHANGELOG.md](./CHANGELOG.md) for release notes and version history.

---

## Team Members

- **Student A**: Showkot Hossain (shossain@nd.edu)
- **Student B**: Md Saiful Islam (mislam5@nd.edu)
