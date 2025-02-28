import { CONFIG } from './config.js';
import { validateEmail, validatePhone } from './utils.js';

export const initializeForms = () => {
  const newsletterForm = document.querySelector(CONFIG.UI.newsletterForm);
  const retreatForm = document.querySelector(CONFIG.UI.retreatForm);

  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email') || document.getElementById('newsletter-email');
    const phone = document.getElementById('phone') || document.getElementById('newsletter-phone');
    const emailValue = email ? email.value : '';
    const phoneValue = phone ? phone.value : '';

    if (!validateEmail(email) || !validatePhone(phone)) {
      alert('Please check your email and phone number.');
      return;
    }
    alert('Thank you for subscribing!');
  });

  retreatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const emailBody = `Start Date: ${formData.get('startDate')}\nEnd Date: ${formData.get('endDate')}\nGuests: ${formData.get('guests')}\nRooms: ${formData.get('rooms')}\nCatering: ${formData.get('catering')}`;
    
    window.location.href = `mailto:admin@usviretreats.com?subject=Retreat Inquiry&body=${encodeURIComponent(emailBody)}`;
  });
};