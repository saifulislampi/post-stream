
# Authentication & Protected Route Implementation

This document explains how authentication and protected routing are implemented in the Post Stream app, using Parse Server and React Router v6.

---

## 🔑 Authentication Service

All authentication logic is centralized in `src/components/auth/AuthService.js`:

- `register(username, email, password)`: Registers a new Parse user and creates a Profile object.
- `login(username, password)`: Logs in a user and fetches their Profile.
- `logout()`: Logs out the current user.
- `getCurrentUser()`: Returns the currently logged-in Parse user (or null).
- `isAuthenticated()`: Returns `true` if a user is logged in with a valid session token.

**Why not use `Parse.User.current()?.authenticated`?**
> The `authenticated` property can be unreliable and may not reflect the true session state. Instead, we check for both user existence and a valid session token for robust authentication.

---

## 🧩 Auth Components & Routing

- **AuthModule.jsx**: Welcome page with login/register options.
- **AuthLogin.jsx**: Login form (Bootstrap styled).
- **AuthRegister.jsx**: Registration form with validation.
- **ProtectedRoute.jsx**: Route guard for authenticated pages. Redirects unauthenticated users to `/auth`.
- **UnauthenticatedRoute.jsx**: Prevents logged-in users from accessing `/auth`, `/login`, or `/register`.

### Route Structure (React Router v6)

Routes are defined using nested layouts and route guards:

```jsx
<Routes>
  {/* Auth routes (only for guests) */}
  <Route element={<UnauthenticatedRoute><AuthLayout /></UnauthenticatedRoute>}>
    <Route path="/auth" element={<AuthModule />} />
    <Route path="/login" element={<AuthLogin onLogin={handleLogin} />} />
    <Route path="/register" element={<AuthRegister onRegister={handleRegister} />} />
  </Route>

  {/* Protected routes (only for logged-in users) */}
  <Route element={<ProtectedRoute><MainLayout currentUser={currentUser} currentProfile={currentProfile} onLogout={handleLogout} /></ProtectedRoute>}>
    <Route path="/" element={<Timeline posts={posts} onAdd={handleAddPost} currentUser={currentUser} currentProfile={currentProfile} />} />
    <Route path="/post/:id" element={<PostPage currentProfile={currentProfile} />} />
    <Route path="/profile/:profileId" element={<ProfilePage currentProfile={currentProfile} />} />
    <Route path="/explore" element={<ExplorePage currentProfile={currentProfile} />} />
  </Route>
</Routes>
```

---

## 🔄 How It Works

### Registration
1. User visits `/register` and submits the form.
2. `register()` creates a new Parse.User and Profile.
3. User is redirected to login or main app.

### Login
1. User visits `/login` and submits credentials.
2. `login()` authenticates and fetches Profile.
3. App state is updated; user is redirected to main app.

### Protected Routing
1. User tries to access a protected route (e.g., `/profile/:profileId`).
2. `ProtectedRoute` checks `isAuthenticated()`.
3. If not authenticated, user is redirected to `/auth`.
4. If authenticated, requested page is rendered inside the main layout.

### Unauthenticated Routing
1. Authenticated user tries to access `/auth`, `/login`, or `/register`.
2. `UnauthenticatedRoute` checks `isAuthenticated()`.
3. If authenticated, user is redirected to `/`.

---

## 🗃️ Data Model

- **User (Parse.User):** Handles authentication (username, email, password, session).
- **Profile (Custom Parse Object):** Stores public user info, stats, and is referenced by posts/comments.

---

## 🧪 Test Users (After Seeding)

- **Username:** `janedoe` | **Password:** `password123`
- **Username:** `johnmayer` | **Password:** `password123`
- **Username:** `adalovelace` | **Password:** `password123`

---

## 🚀 Testing Steps

1. **Clean and seed database:**
   ```bash
   npm run clean
   npm run seed
   ```
2. **Start the app:**
   ```bash
   npm start
   ```
3. **Test the flow:**
   - Visit app (should redirect to `/auth` if not logged in)
   - Register a new user
   - Log in with test users
   - Verify protected routes redirect if not authenticated
   - Test logout and re-login

---

## 🎨 Styling

- Bootstrap-based styling throughout
- Responsive design for mobile and desktop
- Full-screen auth pages with centered cards
- Consistent with overall app design
