import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

/* Firebase Configuration */
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeoVMLudiAxZp4SLYnwMeCOK9OR5cSDSI",
  authDomain: "study-notes-49fea.firebaseapp.com",
  projectId: "study-notes-49fea",
  storageBucket: "study-notes-49fea.firebasestorage.app",
  messagingSenderId: "864538573839",
  appId: "1:864538573839:web:b6e8d254269787b619f77a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const authForm = document.getElementById("authForm");
const formTitle = document.getElementById("formTitle");
const formDescription = document.getElementById("formDescription");
const nameGroup = document.getElementById("nameGroup");
const fullName = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const showPassword = document.getElementById("showPassword");
const submitButton = document.getElementById("submitButton");
const switchModeButton = document.getElementById("switchMode");
const switchText = document.getElementById("switchText");
const messageBox = document.getElementById("authMessage");
const forgotPasswordButton = document.getElementById("forgotPassword");
const forgotPasswordRow = document.getElementById("forgotPasswordRow");

let isSignup = false;

function showMessage(message, type = "info") {
  messageBox.textContent = message;
  messageBox.className = "auth-message " + type;
}

function clearMessage() {
  messageBox.textContent = "";
  messageBox.className = "auth-message";
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  switchModeButton.disabled = isLoading;
  forgotPasswordButton.disabled = isLoading;

  submitButton.textContent = isLoading
    ? "Please wait..."
    : isSignup
      ? "Create Account"
      : "Login";
}

function updateFormMode() {
  clearMessage();

  isSignup = !isSignup;

  nameGroup.hidden = !isSignup;
  fullName.required = isSignup;

  formTitle.textContent = isSignup
    ? "Create Your Account"
    : "Welcome Back!";

  formDescription.textContent = isSignup
    ? "Create an account to access study resources."
    : "Login to access your study resources.";

  submitButton.textContent = isSignup
    ? "Create Account"
    : "Login";

  switchText.textContent = isSignup
    ? "Already have an account?"
    : "Don't have an account?";

  switchModeButton.textContent = isSignup
    ? "Login"
    : "Create Account";

  passwordInput.autocomplete = isSignup
    ? "new-password"
    : "current-password";

  forgotPasswordRow.hidden = isSignup;
}

function getFriendlyError(error) {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email already has an account. Please login.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/weak-password":
      return "Please choose a stronger password.";

    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password is incorrect.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";

    case "auth/operation-not-allowed":
      return "Email/password login is not enabled in Firebase.";

    case "auth/invalid-api-key":
      return "Firebase API key is invalid. Check your configuration.";

    case "auth/unauthorized-domain":
      return "This website domain is not authorized in Firebase.";

    default:
      return "Something went wrong. Check Firebase setup and try again.";
  }
}

/* Show or hide password */
showPassword.addEventListener("click", function () {
  const isVisible = passwordInput.type === "text";

  passwordInput.type = isVisible ? "password" : "text";
  showPassword.textContent = isVisible ? "Show" : "Hide";

  showPassword.setAttribute(
    "aria-pressed",
    String(!isVisible)
  );
});

/* Switch between Login and Signup */
switchModeButton.addEventListener("click", updateFormMode);

/* Login and Signup */
authForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  clearMessage();

  if (!authForm.reportValidity()) {
    return;
  }

  if (isSignup && fullName.value.trim().length < 2) {
    showMessage("Please enter your full name.", "error");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const name = fullName.value.trim();

  setLoading(true);

  try {
    if (isSignup) {
      /* Create account */
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      try {
        await updateProfile(result.user, {
          displayName: name
        });

        await sendEmailVerification(result.user);

        showMessage(
          "Account created! Check your email for the verification link. Verify your email, then log in.",
          "success"
        );
      } catch (followUpError) {
        console.error("Signup follow-up error:", followUpError);

        showMessage(
          "Account created, but profile update or verification email failed. You can try logging in and request verification again later.",
          "info"
        );
      }

      /*
       * Do not redirect after signup.
       * The student should verify their email and log in.
       */
      await signOut(auth);

      authForm.reset();
      passwordInput.type = "password";
      showPassword.textContent = "Show";

      if (isSignup) {
        updateFormMode();
      }

    } else {
      /* Login */
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      /* Require email verification before dashboard access */
      if (!result.user.emailVerified) {
        showMessage(
          "Your email is not verified yet. Open the verification email, click its link, and then log in again.",
          "info"
        );

        await signOut(auth);
        return;
      }

      showMessage(
        "Login successful! Opening your dashboard...",
        "success"
      );

      /* Redirect after successful verified login */
      window.location.replace("dashboard.html");
    }

  } catch (error) {
    console.error("Authentication error:", error);

    showMessage(
      getFriendlyError(error),
      "error"
    );

  } finally {
    setLoading(false);
  }
});

/* Forgot password */
forgotPasswordButton.addEventListener("click", async function () {
  clearMessage();

  const email = emailInput.value.trim();

  if (!email) {
    showMessage(
      "Enter your email address first.",
      "error"
    );

    emailInput.focus();
    return;
  }

  forgotPasswordButton.disabled = true;

  try {
    await sendPasswordResetEmail(auth, email);

    showMessage(
      "If this email is registered, a password reset email will be sent.",
      "success"
    );

  } catch (error) {
    console.error("Password reset error:", error);

    showMessage(
      getFriendlyError(error),
      "error"
    );

  } finally {
    forgotPasswordButton.disabled = false;
  }
});

console.log("Study Notes Hub authentication module loaded.");
