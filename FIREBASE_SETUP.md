# Firebase Setup for Find My Chef

## Step 1: Create a Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Enter project name: `find-my-chef`
4. Accept terms and click "Continue"
5. Disable Google Analytics (optional) and click "Create project"
6. Wait for project creation to complete

## Step 2: Create a Web App

1. Click the web icon `</>` to create a new web app
2. App name: `find-my-chef-web`
3. Check "Also set up Firebase Hosting for this app" (optional)
4. Click "Register app"
5. Copy the Firebase config

## Step 3: Enable Authentication

1. Go to "Authentication" in left sidebar
2. Click "Get started"
3. Under "Sign-in method", click "Email/Password"
4. Enable it and click "Save"

## Step 4: Update .env file

Replace the values in `.env` with your actual Firebase config values from Step 2.

## Step 5: Restart Dev Server

```bash
npm run dev
```

Your app is now ready to use!
