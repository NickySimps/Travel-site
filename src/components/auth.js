import { CONFIG } from './config.js';

export const initializeAuth = () => {
    const authToggle = document.querySelector(CONFIG.UI.authToggle);
    const authForm = document.querySelector(CONFIG.UI.authForm);
    const authFormContent = document.querySelector(CONFIG.UI.authFormContent);

    authToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        authForm?.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.auth-container')) {
            authForm?.classList.remove('active');
        }
    });

    authFormContent?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const isLogin = e.submitter.id === 'login-btn';
        const formData = new FormData(e.target);

        try {
            const response = await fetch(isLogin ? '/api/login' : '/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            const data = await response.json();
            if (response.ok) {
                window.location.href = '/';
            } else {
                alert(data.error || 'Authentication failed');
            }
        } catch (err) {
            console.error('Auth error:', err);
            alert('Network error. Please try again.');
        }
    });
};
