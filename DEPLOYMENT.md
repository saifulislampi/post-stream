# Dual Deployment Strategy Report - Post Stream

**Course Project Technical Report**

This document details the implementation of a dual deployment strategy that allows the same React codebase to be deployed to both Netlify and GitHub Pages automatically, addressing the unique requirements of each platform.

---

## � Executive Summary

We successfully implemented a dual deployment system that enables automatic deployment of the Post Stream React application to both Netlify and GitHub Pages from the same codebase. This required solving platform-specific challenges including:

- **Routing conflicts** between platforms with different base URL requirements
- **Build optimization** for different deployment environments  
- **CI/CD automation** for seamless deployments
- **Production build issues** that prevented proper component rendering

**Key Achievement**: Single codebase → Two live deployments with platform-optimized configurations

---

## 🔧 Technical Implementation

### 1. Platform-Specific Build Scripts

We created separate build commands in `package.json` to handle different base URL requirements:

```json
{
  "scripts": {
    "build": "react-scripts build",
    "build:github": "PUBLIC_URL=/post-stream npm run build",
    "build:netlify": "npm run build"
  }
}
```

**Technical Rationale**:
- **GitHub Pages**: Serves from subdirectory (`/post-stream`), requires PUBLIC_URL prefix
- **Netlify**: Serves from root domain, no PUBLIC_URL needed
- **Environment Variable**: PUBLIC_URL tells React Router the application's base path

### 2. Dynamic Router Configuration

Modified `src/index.js` to handle different base URLs dynamically:

```javascript
// Set basename for GitHub Pages deployment
const basename = process.env.PUBLIC_URL || '';

root.render(
  <React.StrictMode>
    <Router basename={basename}>
      <App />
    </Router>
  </React.StrictMode>
);
```

**Technical Details**:
- `basename` prop tells React Router where the app is mounted
- Dynamically reads from `PUBLIC_URL` environment variable
- Falls back to empty string for root-level deployments (Netlify)

### 3. Production Build Fix

**Problem Identified**: React production builds minify component names, breaking our route configuration that relied on `component.name`.

**Solution Implemented**: Added explicit `name` fields to route configuration:

```javascript
// Before (problematic in production)
const routeConfig = [
  { path: "/", component: Home },
  { path: "/profile", component: Profile }
];

// After (production-safe)
const routeConfig = [
  { path: "/", component: Home, name: "Home" },
  { path: "/profile", component: Profile, name: "Profile" }
];
```

### 4. Automated CI/CD Pipelines

#### GitHub Actions Workflow (`.github/workflows/deploy.yml`)
```yaml
name: Deploy React App to GitHub Pages
on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build for GitHub Pages
        run: npm run build:github
      
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

#### Netlify Configuration (`netlify.toml`)
```toml
[build]
  base = "."
  publish = "build"
  command = "npm run build:netlify"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

**Key Technical Differences**:
- **GitHub Actions**: Explicitly runs `build:github` with PUBLIC_URL
- **Netlify**: Automatically runs `build:netlify` without PUBLIC_URL
- **Netlify Redirects**: Handles client-side routing with catch-all redirect
- **Node.js Version**: Both platforms configured for Node.js 20+ (required by React Router 7.6.3)

### 5. Client-Side Routing Solutions

**Challenge**: Single Page Applications (SPAs) require server configuration to handle direct URL access.

**Platform Solutions**:
- **Netlify**: `redirects` rule in `netlify.toml` catches all routes and serves `index.html`
- **GitHub Pages**: Built-in SPA support when using GitHub Actions deployment

---

## 🔍 Technical Challenges Solved

### 1. Component Minification Issue
- **Problem**: Production builds minified component names from `Home` to `t`, breaking route mapping
- **Root Cause**: Webpack optimization in production mode
- **Solution**: Explicit naming in route configuration instead of relying on `component.name`

### 2. Dual Base URL Management
- **Problem**: GitHub Pages needs `/post-stream` prefix, Netlify needs root path
- **Solution**: Environment-driven basename configuration using `PUBLIC_URL`

### 3. Node.js Version Compatibility
- **Problem**: React Router 7.6.3 requires Node.js >=20.0.0
- **Solution**: Updated both GitHub Actions and Netlify to use Node.js 20

### 4. ESLint Configuration
- **Problem**: `no-loop-func` rule violations in trending hashtags service
- **Solution**: Refactored loop functions to avoid closure issues

---

## � Deployment Architecture

```
┌─────────────────┐    ┌──────────────────┐
│   GitHub Repo   │    │   Single Source  │
│   (main branch) │────│     Codebase     │
└─────────────────┘    └──────────────────┘
         │                       │
         │ git push              │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│ GitHub Actions  │    │  Netlify Hook    │
│ Workflow        │    │  Trigger         │
└─────────────────┘    └──────────────────┘
         │                       │
         │ build:github          │ build:netlify
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│ GitHub Pages    │    │     Netlify      │
│ /post-stream/   │    │   Root Domain    │
└─────────────────┘    └──────────────────┘
```

---

## 📈 Results & Benefits

### Performance Metrics
- **Build Time**: ~2-3 minutes for both platforms
- **Bundle Size**: Optimized production builds (~2MB)
- **Deployment Speed**: Automated deployment within 5 minutes of code push

### Platform Benefits Achieved

| Feature | GitHub Pages | Netlify |
|---------|-------------|---------|
| **Cost** | Free | Free tier |
| **Custom Domain** | ✅ Supported | ✅ Supported |
| **HTTPS** | ✅ Automatic | ✅ Automatic |
| **Client-side Routing** | ✅ Via Actions | ✅ Native support |
| **Branch Previews** | ❌ Main only | ✅ All branches |
| **Build Caching** | ✅ Node modules | ✅ Advanced caching |

### Educational Value
- **DevOps Understanding**: Students learn CI/CD pipeline configuration
- **Platform Differences**: Practical experience with deployment platform constraints
- **Environment Management**: Understanding of build-time environment variables
- **Production Optimization**: Experience with production build challenges

---

## 🎯 Key Learning Outcomes

1. **Multi-Platform Deployment**: Successfully configured same codebase for different hosting environments
2. **Production Debugging**: Identified and resolved production-specific build issues
3. **CI/CD Implementation**: Set up automated deployment pipelines
4. **Environment Configuration**: Managed platform-specific build requirements
5. **Routing Solutions**: Solved SPA routing challenges across different hosting platforms

---

## � How to Deploy This Project

*Instructions for TAs, instructors, or other developers wanting to deploy this codebase*

### Prerequisites
- Node.js 20 or higher
- Git account
- GitHub repository
- Netlify account (optional)

### 1. Fork and Clone
```bash
git clone https://github.com/YOUR_USERNAME/post-stream.git
cd post-stream
npm install
```

### 2. GitHub Pages Deployment

**Automatic Setup:**
1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages  
   - Source: Select "GitHub Actions"
2. **Update repository name** in `package.json` if different:
   ```json
   "build:github": "PUBLIC_URL=/YOUR_REPO_NAME npm run build"
   ```
3. **Push to main branch** - deployment happens automatically

**Manual Deployment:**
```bash
npm run build:github
npm install -g gh-pages
npm run deploy
```

### 3. Netlify Deployment

**Automatic Setup:**
1. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - "Add new site" → "Import an existing project"
   - Connect GitHub and select your forked repository
2. **Build settings** (auto-detected from `netlify.toml`):
   - Build command: `npm run build:netlify`
   - Publish directory: `build`
3. **Deploy**: Click "Deploy site"

**Manual Deployment:**
```bash
npm run build:netlify
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=build
```

### 4. Environment Variables (if needed)

For additional API keys or configuration:

**GitHub Pages:**
- Add to repository Settings → Secrets and variables → Actions
- Prefix with `REACT_APP_`

**Netlify:**
- Add to Site settings → Environment variables  
- Prefix with `REACT_APP_`

### 5. Verification

Test both deployments:
- **GitHub Pages**: `https://YOUR_USERNAME.github.io/post-stream/`
- **Netlify**: `https://YOUR_SITE_NAME.netlify.app/`

Verify all routes work correctly on both platforms.

---

## 🔧 Troubleshooting

**Build Failures:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Routing Issues:**
- Check `PUBLIC_URL` configuration in build scripts
- Verify `basename` prop in Router component
- Ensure client-side routing redirects are configured

**Node.js Version:**
- Both platforms require Node.js 20+
- Update local development environment if needed
