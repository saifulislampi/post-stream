# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

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
