# Firebase Setup Guide for Find My Chef

## Complete Step-by-Step Setup

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click **"Create a project"** button
3. Enter project name: `find-my-chef`
4. Click **"Continue"**
5. Disable Google Analytics (optional) and click **"Create project"**
6. Wait 30 seconds for project creation

### Step 2: Add Web App
1. In Firebase console, click the **Web icon** `</>`
2. App name: `find-my-chef-web`
3. Click **"Register app"**
4. Copy the Firebase config (you'll see something like below):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "find-my-chef-xxx.firebaseapp.com",
  projectId: "find-my-chef-xxx",
  storageBucket: "find-my-chef-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

### Step 3: Enable Authentication
1. In left sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Select **"Email/Password"** sign-in method
4. Toggle it **ON**
5. Click **"Save"**

### Step 4: Update .env File
Open `/home/sasha/Development/frontend-find-my-chef/.env` and replace:

```env
REACT_APP_FIREBASE_API_KEY=YOUR_apiKey_HERE
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_authDomain_HERE
REACT_APP_FIREBASE_PROJECT_ID=YOUR_projectId_HERE
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_storageBucket_HERE
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_messagingSenderId_HERE
REACT_APP_FIREBASE_APP_ID=YOUR_appId_HERE
```

### Step 5: Restart Dev Server
In terminal:
```bash
npm run dev
```

### Step 6: Test
1. Open http://localhost:5174/register
2. Create an account with email/password
3. You should be redirected to dashboard
4. Click Logout

## Troubleshooting

**"Email already in use"** - Normal, means auth is working

**"Configuration error"** - Check `.env` file has correct values (no spaces, exact copy from Firebase)

**"Network error"** - Check Firebase project has Email/Password auth enabled

## Support
If you get stuck, copy the error message and Firebase console link to ask for help.
