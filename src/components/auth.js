// src/components/auth.js - Fixed version
import { CONFIG } from "./config.js";

// Global firebase app reference
let firebaseApp;
let firebaseAuth;

// Action code settings for email link sign-in - fixed URL to be more robust
const actionCodeSettings = {
  // Use window.location.origin for more robust URL handling
  url: window.location.origin + "/login-complete.html",
  handleCodeInApp: true,
};

export const initializeAuth = (firebaseAlreadyInitialized = false) => {
  console.log("Starting authentication initialization...");

  // Check if Firebase is already initialized
  if (typeof firebase === "undefined") {
    console.error(
      "Firebase SDK not loaded. Make sure Firebase scripts are included in your HTML."
    );
    return;
  }

  try {
    // Use existing Firebase app or initialize a new one
    if (!firebase.apps.length) {
      console.log("Initializing new Firebase app");
      // Make sure we have the complete config
      const completeConfig = {
        apiKey: CONFIG.FIREBASE.apiKey,
        authDomain: "travel-site-c65a7.firebaseapp.com", // Make sure this is correct
        projectId: "travel-site-c65a7",
        storageBucket: "travel-site-c65a7.appspot.com",
        messagingSenderId: CONFIG.FIREBASE.messagingSenderId,
        appId: CONFIG.FIREBASE.appId,
      };

      firebaseApp = firebase.initializeApp(completeConfig);
    } else {
      console.log("Using existing Firebase app");
      firebaseApp = firebase.app();
    }

    // Initialize auth
    firebaseAuth = firebase.auth();
    console.log("Firebase Auth initialized successfully");

    // Set up the authentication UI and state listener
    setupAuthUI();

    // Log auth state for debugging
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User is signed in:", user.email);
      } else {
        console.log("No user is signed in");
      }
    });

    // Handle email link sign-in if we're on the login-complete page
    if (window.location.pathname.includes("login-complete.html")) {
      handleEmailSignIn();
    }
  } catch (error) {
    console.error("Error during auth initialization:", error);
  }
};

function setupAuthUI() {
  // Find all auth elements in the page
  const authStatusElement = document.getElementById("auth-status");
  const authForm = document.getElementById("auth-form");
  const userEmailSpan = authStatusElement?.querySelector(".user-email"); // Assume you add this span
  const loginButton = document.getElementById("auth-toggle"); // The initial login button
  const logoutButton = document.getElementById("logout-btn"); // Might need to create/find this
  const authFormContent = document.getElementById("auth-form-content");

  // Only proceed if the necessary elements are found
  if (!authStatusElement) {
    console.log("Auth status element not found in this page");
    return;
  }

  // Set up auth state listener
  // --- Get references to ALL potential elements upfront ---

  // ... other elements like the form itself ...

  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      // User is logged in
      if (userEmailSpan) userEmailSpan.textContent = user.email;
      if (loginButton) loginButton.style.display = "none"; // Hide login button
      if (authForm) authForm.classList.remove("active"); // Hide form if open
      if (authForm) authForm.style.display = "none";
      if (logoutButton) logoutButton.style.display = "block"; // Show logout button

      // Ensure logout listener is attached (only if logoutButton exists)
      if (
        logoutButton &&
        !logoutButton.hasAttribute("data-listener-attached")
      ) {
        logoutButton.addEventListener("click", () => {
          /* ... sign out logic ... */
        });
        logoutButton.setAttribute("data-listener-attached", "true");
      }
    } else {
      // User is logged out
      if (userEmailSpan) userEmailSpan.textContent = "";
      if (loginButton) loginButton.style.display = "block"; // Show login button
      if (logoutButton) logoutButton.style.display = "none"; // Hide logout button
      if (authForm) authForm.style.display = "none"; // Ensure form container is potentially visible
      // Ensure form is hidden initially
      if (authForm) authForm.style.display = "none";

      // Add hover effect to show form on mouseover of login button
      if (loginButton) {
        loginButton.addEventListener("mouseover", () => {
          if (authForm && !firebaseAuth.currentUser) {
            authForm.style.display = "block";
          }
        });

        loginButton.addEventListener("mouseout", () => {
          if (authForm && !firebaseAuth.currentUser && !authForm.classList.contains("active")) {
            authForm.style.display = "none";
          }
        });
      }

      // Ensure login button listener is attached (only if loginButton exists)
      if (loginButton && !loginButton.hasAttribute("data-listener-attached")) {
        loginButton.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (authForm) authForm.classList.toggle("active");
        });
        loginButton.setAttribute("data-listener-attached", "true");
      }
      // Ensure form submission listener is attached (only if form exists)
      if (
        authFormContent &&
        !authFormContent.hasAttribute("data-listener-attached")
      ) {
        authFormContent.addEventListener("submit", async (e) => {
          /* ... send link logic ... */
        });
        authFormContent.setAttribute("data-listener-attached", "true");
      }
    }
  });

  // Add initial listener for clicking outside the form (if applicable)
  document.addEventListener("click", (e) => {
    if (
      authForm &&
      authForm.classList.contains("active") &&
      !e.target.closest(".auth-container")
      && !e.target.closest("#auth-toggle")) {
      authForm.classList.remove("active");
    }
  });
}

function handleEmailSignIn() {
  console.log("Detected login-complete page, handling email sign-in");

  if (firebaseAuth.isSignInWithEmailLink(window.location.href)) {
    console.log("Valid sign-in link detected");

    let email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      email = window.prompt("Please provide your email for confirmation");
    }

    if (email) {
      console.log("Attempting to sign in with email link");
      firebaseAuth
        .signInWithEmailLink(email, window.location.href)
        .then(() => {
          console.log("Sign-in successful");
          window.localStorage.removeItem("emailForSignIn");

          // Redirect to home page after successful login
          window.location.href = window.location.origin + "/index.html";
        })
        .catch((error) => {
          console.error("Error signing in with email link:", error);
          document.getElementById(
            "status-message"
          ).textContent = `Error signing in: ${error.message}`;
        });
    } else {
      console.warn("No email provided, cannot complete sign-in");
    }
  } else {
    console.warn("Not a valid sign-in link:", window.location.href);
  }
}

export const signOut = () => {
  if (!firebaseAuth) {
    console.error("Firebase Auth not initialized");
    return Promise.reject(new Error("Firebase Auth not initialized"));
  }
  return firebaseAuth.signOut();
};
