import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

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

const studentEmail = document.getElementById("studentEmail");
const profileEmail = document.getElementById("profileEmail");
const message = document.getElementById("dashboardMessage");

onAuthStateChanged(auth, (user) => {
  if (user) {
    studentEmail.textContent = "Logged in as: " + user.email;
    profileEmail.textContent = user.email;

    message.textContent =
      "Login successful! Your student dashboard is ready.";
    message.style.background = "#dcfce7";
    message.style.color = "#166534";
  } else {
    window.location.replace("login.html");
  }
});

async function logout() {
  try {
    await signOut(auth);
    window.location.replace("login.html");
  } catch (error) {
    message.textContent = "Logout failed. Please try again.";
  }
}

document.getElementById("logoutButton").addEventListener(
  "click", logout
);

document.getElementById("logoutButton2").addEventListener(
  "click", logout
);
