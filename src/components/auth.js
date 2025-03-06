// auth.js
import { CONFIG } from 'config.js';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Initialize Firebase using the global firebase object
const firebaseConfig = CONFIG.FIREBASE;
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

//Detect auth state change





const actionCodeSettings = {
    url: window.location.origin + '/login-complete.html',
    handleCodeInApp: true
};

export const initializeAuth = () => {
    const authToggle = document.querySelector(CONFIG.UI.authToggle);
    const authForm = document.querySelector(CONFIG.UI.authForm);
    const authFormContent = document.querySelector(CONFIG.UI.authFormContent);

    onAuthStateChangedauth, (user) => {
        if (!user) {
            console.log('logged in.');
        }  else {
            console.log('no user');
        }
        
    }

    const updateAuthUI = (user) => {
        if (user) {
            authToggle.innerHTML = `
                <span class="user-email">${user.email}</span>
                <div class="user-dropdown">
                    <button id="logout-btn">Logout</button>
                </div>
            `;
            authForm?.classList.remove('active');
        } else {
            authToggle.textContent = 'Login';
            authFormContent.innerHTML = `
                <input type="email" name="email" placeholder="Email" required>
                <div class="auth-buttons">
                    <button type="submit" id="login-btn">Login with Email</button>
                </div>
            `;
        }
    };

    // Check if the current page is handling an email sign-in link
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            email = window.prompt('Please provide your email for confirmation');
        }

        firebase.auth().signInWithEmailLink(email, window.location.href)
            .then(() => {
                window.localStorage.removeItem('emailForSignIn');
                window.location.href = '/'; // Redirect to home page
            })
            .catch((error) => {
                alert('Error signing in: ' + error.message);
            });
    }

    // Auth state observer
    firebase.auth().onAuthStateChanged(updateAuthUI);

    // Toggle auth form
    authToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!auth.currentUser) {
            authForm?.classList.toggle('active');
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.auth-container')) {
            authForm?.classList.remove('active');
        }
    });

    // Handle form submission
    authFormContent?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.email.value;

        try {
            await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            alert('Check your email for the login link!');
            authForm.classList.remove('active');
        } catch (error) {
            alert('Error sending login link: ' + error.message);
        }
    });

    // Handle logout
    document.addEventListener('click', async (e) => {
        if (e.target.id === 'logout-btn') {
            try {
                await firebase.auth().signOut();
            } catch (error) {
                console.error('Error signing out:', error);
            }
        }
    });
};