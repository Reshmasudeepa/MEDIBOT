export function firebaseErrorMessage(code: string | undefined, fallback = "An error occurred") {
  if (!code) return fallback;
  switch (code) {
    case "auth/invalid-email":
      return "The email address is badly formatted.";
    case "auth/email-already-in-use":
      return "This email is already in use. Try signing in or resetting password.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/expired-action-code":
      return "This verification link has expired. Request a new verification email.";
    case "auth/invalid-action-code":
      return "This verification link is invalid or already used.";
    default:
      return fallback;
  }
}
