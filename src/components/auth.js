// src/components/auth.js - Fixed version
import { CONFIG } from "./config.js";

// Global firebase app and auth references
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
    // Initialize Firebase app if not already done
    if (!firebase.apps.length) {
      console.log("Initializing new Firebase app");
      // Use the config directly
      firebaseApp = firebase.initializeApp(CONFIG.FIREBASE);
    } else {
      console.log("Using existing Firebase app");
      firebaseApp = firebase.app();
    }

    // Initialize auth
    firebaseAuth = firebase.auth();
    console.log("Firebase Auth initialized successfully");

    // Set up the authentication UI and state listener
    setupAuthUI();

    // Attach event listeners once on initialization
    attachAuthListeners();

    // NOTE: The logic for handling the email sign-in link is now exclusively in login-handler.js,
    // which runs on the login-complete.html page.
  } catch (error) {
    console.error("Error during auth initialization:", error);
  }
};

function setupAuthUI() {
  // Get references to ALL potential auth elements upfront
  const authStatusElement = document.getElementById("auth-status");
  const authForm = document.getElementById("auth-form");
  const userEmailSpan = authStatusElement?.querySelector(".user-email"); // Assume you add this span
  const loginButton = document.getElementById("auth-toggle"); // The initial login button
  const logoutButton = document.getElementById("logout-btn"); // Might need to create/find this
  const authFormContent = document.getElementById("auth-form-content"); // The form itself

  // Set up auth state listener
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      // User is logged in
      console.log("Auth State Changed: User is signed in:", user.email);
      if (userEmailSpan) userEmailSpan.textContent = user.email;
      if (loginButton) loginButton.style.display = "none"; // Hide the 'Login' button
      if (authForm) authForm.classList.remove("active"); // Hide the login form dropdown
      if (authForm) authForm.style.display = "none"; // Ensure the form container is hidden
      if (logoutButton) logoutButton.style.display = "block"; // Show the 'Logout' button
      // You might also want to show the user's email or name here
      const userDisplay = document.getElementById('user-display');
      if (userDisplay) userDisplay.textContent = `Welcome, ${user.email}`; // Or user.displayName

    } else {
      // User is logged out
      console.log("Auth State Changed: No user is signed in");
      if (userEmailSpan) userEmailSpan.textContent = "";
      if (loginButton) loginButton.style.display = "block"; // Show the 'Login' button
      if (logoutButton) logoutButton.style.display = "none"; // Hide the 'Logout' button
      if (authForm) authForm.classList.remove("active"); // Ensure form dropdown is hidden
      if (authForm) authForm.style.display = "none"; // Ensure form container is hidden
      const userDisplay = document.getElementById('user-display');
      if (userDisplay) userDisplay.textContent = ''; // Clear user display
    }
  });

  // Initial check to set UI state correctly on page load
  const initialUser = firebaseAuth.currentUser;
  if (initialUser) {
    console.log("Initial Auth State: User is signed in:", initialUser.email);
    if (loginButton) loginButton.style.display = "none";
    if (logoutButton) logoutButton.style.display = "block";
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) userDisplay.textContent = `Welcome, ${initialUser.email}`;
  } else {
    console.log("Initial Auth State: No user is signed in");
    if (loginButton) loginButton.style.display = "block";
    if (logoutButton) logoutButton.style.display = "none";
  }
}

function attachAuthListeners() {
  const authForm = document.getElementById("auth-form"); // The dropdown container
  const loginButton = document.getElementById("auth-toggle"); // The initial login button
  const logoutButton = document.getElementById("logout-btn"); // The logout button
  const authFormContent = document.getElementById("auth-form-content"); // The form itself

  // Listener for the Login button click to toggle form visibility
  if (loginButton) {
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (authForm) {
        authForm.classList.toggle("active");
        // Use style.display as a fallback or for initial state, but prefer CSS class for toggle
        if (authForm.classList.contains("active")) {
            authForm.style.display = "block";
        } else {
            authForm.style.display = "none";
        }
      }
    });
  }

  // Listener for the form submission (sending email link)
  if (authFormContent) {
    authFormContent.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent default form submission
      const emailInput = authFormContent.querySelector('input[type="email"]');

      if (!emailInput) {
        console.error("Email input not found in auth form content.");
        alert("An error occurred. Email field is missing.");
        return;
      }
      const email = emailInput.value.trim();

      if (!email) {
        alert("Please enter your email address.");
        emailInput.focus();
        return;
      }

      const submitButton = authFormContent.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      // You could add a message like "Sending link..." to the UI here

      try {
        console.log(`Attempting to send sign-in link to ${email}`);
        await firebaseAuth.sendSignInLinkToEmail(email, actionCodeSettings);
        window.localStorage.setItem("emailForSignIn", email); // Store email for login-complete.html

        alert("A login link has been sent to your email. Please check your inbox (and spam folder) to complete sign-in.");

        emailInput.value = ""; // Clear the input
        if (authForm) { // authForm is the div container for the header form
            authForm.classList.remove("active"); // Hide form dropdown
            authForm.style.display = "none"; // Ensure it's hidden
        }

      } catch (error) {
        console.error("Error sending sign-in link:", error);
        let errorMessage = "Failed to send login link.";
        if (error.code === 'auth/invalid-email') {
            errorMessage = "The email address is not valid. Please enter a valid email.";
        } else if (error.code === 'auth/missing-action-code') {
             errorMessage = "Invalid or expired login link. Please request a new one.";
        }
        alert(`${errorMessage} Please try again. Details: ${error.message}`);
      } finally {
        if (submitButton) submitButton.disabled = false; // Re-enable button
      }
    });
  }

  // Listener for the Logout button click
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      try {
        await signOut();
        console.log("User signed out successfully");
        // UI will be updated by the onAuthStateChanged listener
      } catch (error) {
        console.error("Error signing out:", error);
        alert("Failed to sign out. Please try again.");
      }
    });
  }

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

export const signOut = () => {
  if (!firebaseAuth) {
    console.error("Firebase Auth not initialized");
    return Promise.reject(new Error("Firebase Auth not initialized"));
  }
  return firebaseAuth.signOut();
};
