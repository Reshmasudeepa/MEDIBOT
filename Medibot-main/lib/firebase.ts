
import { initializeApp } from "firebase/app"
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  sendEmailVerification,
  applyActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset
} from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getMessaging } from "firebase/messaging"

// Use environment variables with fallback to prevent client-side access errors
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCE3OyJiubM6fl9xI7OIZ8QS2JB66Yx3Yw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "medibot-261d1.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://medibot-261d1-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "medibot-261d1",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "medibot-261d1.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "769639197808",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:769639197808:web:bbc3e96b57a47c1ecb18b5",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-S2P9Z44FR2",
}

// Initialize Firebase
let app
try {
  app = initializeApp(firebaseConfig)
} catch (error) {
  console.error("Firebase initialization error:", error)
  // Fallback initialization
  app = initializeApp(firebaseConfig)
}

export const auth = getAuth(app)

// Configure auth persistence to survive browser restart by default
auth.useDeviceLanguage();

export const db = getFirestore(app)
export const storage = getStorage(app)
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null

// Auth providers
export const googleProvider = new GoogleAuthProvider()
export const facebookProvider = new FacebookAuthProvider()

// Configure providers
googleProvider.setCustomParameters({
  prompt: "select_account",
})

facebookProvider.setCustomParameters({
  display: "popup",
})

// Email verification functions
export const sendVerificationEmail = async (user: any) => {
  try {
    await sendEmailVerification(user, {
      url: `${window.location.origin}/auth/signin`, // Redirect URL after verification
      handleCodeInApp: false,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return { success: false, error: error.message };
  }
};

export const verifyEmailAction = async (actionCode: string) => {
  try {
    await applyActionCode(auth, actionCode);
    return { success: true };
  } catch (error: any) {
    console.error("Error verifying email:", error);
    return { success: false, error: error.message };
  }
};

export default app
