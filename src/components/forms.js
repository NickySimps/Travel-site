import { CONFIG } from './config.js';
import { validateEmail, validatePhone } from './utils.js';

export const initializeForms = () => {
  const newsletterForm = document.querySelector(CONFIG.UI.newsletterForm);
  const retreatForm = document.querySelector(CONFIG.UI.retreatForm);

  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    // Use specific IDs for newsletter form inputs
    const emailInput = newsletterForm.querySelector('#newsletter-email');
    const phoneInput = newsletterForm.querySelector('#newsletter-phone');
    const firstNameInput = newsletterForm.querySelector('#firstName');
    const lastNameInput = newsletterForm.querySelector('#lastName');

    let isValid = true;
    let errorMessages = [];

    if (!firstNameInput || !firstNameInput.value.trim()) {
        isValid = false;
        errorMessages.push('First name is required.');
    }
    if (!lastNameInput || !lastNameInput.value.trim()) {
        isValid = false;
        errorMessages.push('Last name is required.');
    }

    if (!emailInput || !validateEmail(emailInput.value)) {
      isValid = false;
      errorMessages.push('Please enter a valid email address.');
    }
    if (!phoneInput || !validatePhone(phoneInput.value)) {
      isValid = false;
      errorMessages.push('Please enter a valid phone number.');
    }

    if (!isValid) {
      alert('Please correct the following errors:\n- ' + errorMessages.join('\n- '));
      return;
    }

    alert('Thank you for subscribing!');
    newsletterForm.reset(); // Optionally reset the form
  });

  retreatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inquiryDetails = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      specialRequests: formData.get('specialRequests'),
      // You would also include bookingSummary details here, passed from booking.js or retrieved
    };

    console.log('Retreat Inquiry Submitted:', inquiryDetails);
    alert('Thank you for your inquiry! We will get back to you soon.');
    // TODO: Replace mailto with an actual backend submission (e.g., to a Firebase Cloud Function)
    // Example: sendInquiryToBackend(inquiryDetails);
    retreatForm.reset(); // Optionally reset the form
  });
};