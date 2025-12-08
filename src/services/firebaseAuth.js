import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import api from '../api/axios';

/**
 * Sign in with Google using Firebase popup
 * Returns Firebase user and ID token
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Get Firebase ID token to send to backend
    const idToken = await user.getIdToken();
    
    return {
      user,
      idToken,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

/**
 * Authenticate with backend using Firebase ID token
 * Sends token to backend for verification and user creation
 */
export const authenticateWithBackend = async (idToken) => {
  try {
    const response = await api.post('/auth/google', {
      firebase_id_token: idToken,
    });
    
    return response.data;
  } catch (error) {
    console.error('Backend authentication error:', error);
    throw error;
  }
};

/**
 * Complete Google sign-in flow
 * 1. Sign in with Google
 * 2. Get Firebase token
 * 3. Send to backend for verification
 * 4. Return user data and JWT token
 */
export const googleLogin = async () => {
  try {
    // Step 1: Sign in with Google
    const { idToken, email, displayName } = await signInWithGoogle();
    
    // Step 2: Send Firebase token to backend
    const backendResponse = await authenticateWithBackend(idToken);
    
    return {
      success: true,
      user: backendResponse.user,
      token: backendResponse.access_token,
    };
  } catch (error) {
    let errorMessage = 'Google sign-in failed';
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in cancelled';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Pop-up blocked. Please allow pop-ups for this site';
    } else if (error.response?.status === 503) {
      errorMessage = 'Google login is not configured on the server. Please contact support.';
    } else if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Sign out from Firebase
 */
export const signOutFromFirebase = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Firebase sign-out error:', error);
  }
};

/**
 * Listen to Firebase auth state changes
 * Useful for detecting when user signs out from another tab
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
