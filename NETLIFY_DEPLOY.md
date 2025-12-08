# Netlify Deployment Guide for Find My Chef

## Quick Deploy Steps

1. **Connect Repository to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select the `frontend-find-my-chef` repository
   - Choose the `bookings` branch (or your main branch)

2. **Build Settings** (Auto-detected from netlify.toml)
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 20

3. **Environment Variables** (CRITICAL!)
   Go to Site settings → Environment variables and add:
   
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_URL=https://your-backend-url.com/api
   ```

4. **Deploy!**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at: `https://random-name-123.netlify.app`

## Common Issues & Fixes

### Issue: White screen after deploy
**Fix:** Check that all environment variables are set correctly in Netlify dashboard

### Issue: 404 on refresh
**Fix:** Already handled by `_redirects` file and `netlify.toml`

### Issue: API calls failing
**Fix:** Update `VITE_API_URL` to point to your deployed backend

### Issue: Firebase authentication not working
**Fix:** 
1. Go to Firebase Console
2. Authentication → Settings → Authorized domains
3. Add your Netlify domain: `your-site.netlify.app`

## Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Add custom domain
3. Follow DNS configuration instructions

## Continuous Deployment

Every push to your connected branch will trigger a new deployment automatically!
