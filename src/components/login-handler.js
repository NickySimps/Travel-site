// src/components/login-handler.js
function updateStatus(message) {
    console.log(message);
    document.getElementById('status-message').textContent = message;
}

document.addEventListener('DOMContentLoaded', () => {
    updateStatus("DOM loaded, starting authentication process...");
    
    // Firebase configuration from your config
    const firebaseConfig = {
        apiKey: "AIzaSyAvKfaFzdlTzodxD2jQSLExl2haQSxvkiw",
        authDomain: "usvi-retreats.firebaseapp.com",
        projectId: "usvi-retreats",
        storageBucket: "usvi-retreats.appspot.com",
        messagingSenderId: "515419394066",
        appId: "1:515419394066:web:26dfc4f17f41bf205e08cb"
    };
    
    try {
        // Initialize Firebase
        if (!firebase.apps.length) {
            updateStatus("Initializing Firebase...");
            firebase.initializeApp(firebaseConfig);
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
                            window.location.href = '/'; // Adjust path as needed
                        }, 1000);
                    })
                    .catch((error) => {
                        updateStatus(`Error signing in: ${error.message}`);
                        console.error('SignIn Error:', error);
                    });
            } else {
                updateStatus("No email provided, cannot complete sign-in");
            }
        } else {
            updateStatus("Not a valid sign-in link. URL: " + window.location.href.substring(0, 50) + "...");
        }
    } catch (error) {
        updateStatus(`Initialization error: ${error.message}`);
        console.error('Overall Error:', error);
    }
});