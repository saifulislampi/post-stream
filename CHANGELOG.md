# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.3.0] - 2025-07-10

### Added
- Authentication system with register, login, and logout functionality
- Parse Auth Service for handling user authentication and session management
- ProtectedRoute component to secure routes requiring authentication
- UnauthenticatedRoute component to prevent authenticated users from accessing login/signup pages
- Comprehensive Authentication Module with the following features:
  - Protected routes that cannot be accessed without authentication
  - Automatic redirection to login when accessing protected content
  - Prevention of authenticated users accessing authentication pages
  - URL protection for users manually typing protected route paths
- New Profile class that separates user identity from profile data
- Automatic profile creation during user registration

### Changed
- Restructured App.jsx, extracting routing logic to dedicated components
- Implemented route configuration using routeConfig.jsx for cleaner route definitions
- Redesigned database schema to separate authentication (User) from profile data (Profile)
- Updated data relationships - posts and comments now reference author profiles instead of users
- Implemented layout templates (AuthLayout and MainLayout) using React Router's Outlet component
- Refactored header components to properly display current user information
- Improved login flow with proper error handling and feedback

### Fixed
- Post author display issues when creating posts with different users
- Route protection bypass vulnerabilities
- Follow/unfollow functionality
- Unnecessary container nesting

## [0.2.0] - 2025-07-01

### Added
- Introduced React Router for seamless navigation; post details now open on their own page instead of replacing the timeline.
- Integrated Parse backend: posts are now submitted and fetched from the backend (previously used local storage).
- Added dedicated Post Detail, Explore, and User Profile pages.
- Implemented user follow/unfollow functionality.
- Modern, responsive layout inspired by Twitter, built with Bootstrap.
- Sticky header on mobile and sidebar navigation on desktop for improved UX.
- Added component tree diagram (DOT file) and database UML diagram for better documentation.
- Character count indicator added to the post form.
- Post detail page now supports replies.
- Introduced UI-only elements for trending topics and "Who to follow" suggestions in the right panel.
- Added username field to user profiles and posts.

### Changed
- Migrated from Preact to React for all components.
- Redesigned the layout of all major pages for a cleaner, more modern look.
- Header is now a sidebar (desktop) instead of a topbar.
- Search functionality is now exclusive to the Explore page.
- Removed the post category feature for simplicity.
- Updated the post action bar with a modernized appearance.

### Fixed
- Resolved issues with search not returning correct results.
- Fixed layout breakage on small screens for better mobile responsiveness.
