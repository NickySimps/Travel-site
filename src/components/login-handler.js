import { CONFIG } from './config.js'; 

document.addEventListener('DOMContentLoaded', () => {
    const statusElement = document.getElementById('status-message');
    
    function updateStatus(message) {
        console.log(message);
        if (statusElement) {
            statusElement.textContent = message;
        }
    }
    
    updateStatus("DOM loaded, starting authentication process...");
    
    
    try {
        // Initialize Firebase
        if (!firebase.apps.length) {
            updateStatus("Initializing Firebase...");
            firebase.initializeApp(CONFIG.FIREBASE);
        } else {
            updateStatus("Firebase already initialized");
        }
        
        const auth = firebase.auth();
        
        // Check if this is a sign-in link
        if (auth.isSignInWithEmailLink(window.location.href)) {
            updateStatus("Valid sign-in link detected!");
            
            // Get email from localStorage
            let email = localStorage.getItem('emailForSignIn');
            if (!email) {
                // If no email in localStorage, prompt the user
                updateStatus("Email not found in local storage, requesting input...");
                email = window.prompt('Please provide your email for confirmation');
            } else {
                updateStatus(`Email found in storage: ${email.substring(0, 3)}...`);
            }
            
            if (email) {
                updateStatus("Attempting to sign in...");
                // Sign in
                auth.signInWithEmailLink(email, window.location.href)
                    .then(() => {
                        updateStatus("Sign-in successful! Redirecting...");
                        localStorage.removeItem('emailForSignIn');
                        setTimeout(() => {
                            window.location.href = window.location.origin + '/index.html';
                        }, 1500);
                    })
                    .catch((error) => {
                        updateStatus(`Error signing in: ${error.message}`);
                        console.error('SignIn Error:', error);
                    });
            } else {
                updateStatus("No email provided, cannot complete sign-in");
            }
        } else {
            updateStatus("Not a valid sign-in link. This page is only for completing the email login process.");
        }
    } catch (error) {
        updateStatus(`Initialization error: ${error.message}`);
        console.error('Overall Error:', error);
    }
});