import { initializeApp, getApps, getApp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdTokenResult
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/*
  IMPORTANT:
  Firebase config ko apne existing auth.js/dashboard.js
  wale config se replace karo.
  Apna config chat mein share mat karna.
*/

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeoVMLudiAxZp4SLYnwMeCOK9OR5cSDSI",
  authDomain: "study-notes-49fea.firebaseapp.com",
  projectId: "study-notes-49fea",
  storageBucket: "study-notes-49fea.firebasestorage.app",
  messagingSenderId: "864538573839",
  appId: "1:864538573839:web:b6e8d254269787b619f77a",
};

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

const auth = getAuth(app);

const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");

const loginForm = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("adminEmail");
const passwordInput = document.getElementById("adminPassword");

const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");
const dashboardMessage = document.getElementById("dashboardMessage");

const logoutButton = document.getElementById("logoutButton");
const adminEmailDisplay = document.getElementById("adminEmailDisplay");

function showLogin(message = "") {
  loginSection.hidden = false;
  dashboardSection.hidden = true;
  loginMessage.textContent = message;
}

function showDashboard(user) {
  loginSection.hidden = true;
  dashboardSection.hidden = false;

  adminEmailDisplay.textContent = user.email || "Authorized Admin";
  dashboardMessage.textContent = "";
}

function showError(message) {
  loginMessage.textContent = message;
}

async function checkAdmin(user) {
  if (!user) {
    showLogin();
    return false;
  }

  try {
    const tokenResult = await getIdTokenResult(user, true);

    if (tokenResult.claims.admin !== true) {
      await signOut(auth);
      showLogin(
        "Is account ko administrator permission nahi mili hai."
      );
      return false;
    }

    showDashboard(user);
    return true;
  } catch (error) {
    console.error("Admin verification failed:", error);
    showLogin("Admin permission verify nahi ho saki. Dobara try karo.");
    return false;
  }
}

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showError("Email aur password dono enter karo.");
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = "Checking...";
  loginMessage.textContent = "";

  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = credential.user;

    if (!user.emailVerified) {
      await signOut(auth);
      showError("Pehle apna email verify karo.");
      return;
    }

    await checkAdmin(user);
  } catch (error) {
    console.error("Admin login failed:", error);

    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found"
    ) {
      showError("Email ya password sahi nahi hai.");
    } else if (error.code === "auth/too-many-requests") {
      showError("Bahut attempts hue. Thodi der baad try karo.");
    } else {
      showError("Login nahi hua. Firebase settings check karo.");
    }
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Sign In";
    passwordInput.value = "";
  }
});

logoutButton.addEventListener("click", async function () {
  try {
    await signOut(auth);
    showLogin("Aap sign out ho gaye hain.");
  } catch (error) {
    console.error("Logout failed:", error);
    dashboardMessage.textContent = "Sign out nahi hua. Dobara try karo.";
  }
});

onAuthStateChanged(auth, async function (user) {
  if (!user) {
    showLogin();
    return;
  }

  await checkAdmin(user);
});
