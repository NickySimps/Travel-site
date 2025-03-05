// auth.js
import { CONFIG } from 'config.js';
import { 
    getAuth, 
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    signOut,
    onAuthStateChanged 
} from 'firebase/auth';

const firebaseConfig = CONFIG.FIREBASE;
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const actionCodeSettings = {
    url: window.location.origin + '/login-complete.html',
    handleCodeInApp: true
};

export const initializeAuth = () => {
    const authToggle = document.querySelector(CONFIG.UI.authToggle);
    const authForm = document.querySelector(CONFIG.UI.authForm);
    const authFormContent = document.querySelector(CONFIG.UI.authFormContent);

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
    if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            email = window.prompt('Please provide your email for confirmation');
        }

        signInWithEmailLink(auth, email, window.location.href)
            .then(() => {
                window.localStorage.removeItem('emailForSignIn');
                window.location.href = '/'; // Redirect to home page
            })
            .catch((error) => {
                alert('Error signing in: ' + error.message);
            });
    }

    // Auth state observer
    onAuthStateChanged(auth, updateAuthUI);

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
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
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
                await signOut(auth);
            } catch (error) {
                console.error('Error signing out:', error);
            }
        }
    });
};