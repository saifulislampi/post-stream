# Deployment Guide for Post Stream

This guide covers how to deploy your Post Stream app to both Netlify and GitHub Pages.

## 🚀 Netlify Deployment (Recommended)

Netlify is easier for React apps with client-side routing.

### Automatic Deployment (Recommended)

1. **Push your code to GitHub** (if not already done)
2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select your `post-stream` repository
3. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `build`
   - (These should auto-detect from netlify.toml)
4. **Deploy:** Click "Deploy site"

### Manual Deployment

```bash
# Build the app
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=build
```

### Environment Variables

If you need environment variables (like API keys):
1. Go to Site settings → Environment variables
2. Add your variables (e.g., `REACT_APP_API_KEY`)

---

## 📘 GitHub Pages Deployment

### Automatic Deployment (GitHub Actions)

Your repository is already set up with GitHub Actions. Every push to `main` will automatically deploy.

**Setup Steps:**
1. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"
2. **Push to main branch** - deployment happens automatically

### Manual Deployment

```bash
# Build and deploy manually
npm run deploy
```

### Important Notes for GitHub Pages:

1. **Routing:** GitHub Pages doesn't support client-side routing by default
2. **Base URL:** Your app will be at `https://saifulislampi.github.io/post-stream/`
3. **404 Handling:** May need a `404.html` redirect for React Router

---

## 🔧 Configuration Differences

### Netlify Benefits:
- ✅ Perfect React Router support
- ✅ Easy environment variables
- ✅ Branch previews
- ✅ Form handling
- ✅ Custom domains
- ✅ Edge functions

### GitHub Pages Benefits:
- ✅ Free for public repos
- ✅ Integrated with GitHub
- ✅ Simple setup
- ❌ Limited React Router support
- ❌ No server-side features

---

## 🌐 Custom Domain (Optional)

### For Netlify:
1. Go to Site settings → Domain management
2. Add custom domain
3. Follow DNS instructions

### For GitHub Pages:
1. Go to Settings → Pages
2. Add custom domain in "Custom domain" field
3. Add CNAME record in your DNS

---

## 🔍 Troubleshooting

### Build Fails:
- Check Node.js version (should be 18+)
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### React Router Issues (GitHub Pages):
- Consider using HashRouter instead of BrowserRouter
- Or add 404.html redirect

### Environment Variables Not Working:
- Must start with `REACT_APP_`
- Restart development server after adding them

---

## 📝 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Build passes locally (`npm run build`)
- [ ] Environment variables configured
- [ ] Domain configured (if using custom domain)
- [ ] HTTPS enabled
- [ ] Test all routes work after deployment
