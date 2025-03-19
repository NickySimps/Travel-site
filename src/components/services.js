import { CONFIG } from './config.js';

export const initializeServices = () => {
  document.querySelectorAll('.service-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const packagesSection = document.querySelector('#packages');
      packagesSection?.scrollIntoView({ behavior: 'smooth' });
      
      const targetPackage = document.querySelector(`[data-package-type="${button.dataset.service}"]`);
      if (targetPackage) {
        targetPackage.classList.add('highlighted');
        setTimeout(() => targetPackage.classList.remove('highlighted'), 2000);
      }
    });
  });

  document.querySelectorAll('.btn-service').forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('selected');
      updateCartButton(button.closest('.flavor-content'));
    });
  });
};

const updateCartButton = (container) => {
  const cartButton = container?.querySelector('.cart-add-item');
  const selectedServices = [...container?.querySelectorAll('.btn-service.selected') || []];
  const services = selectedServices.map(btn => btn.dataset.service);
  
  cartButton.dataset.itemCustom3Value = 
    services.includes('catering') && services.includes('transport') ? 'Both' :
    services.includes('catering') ? 'Catering' :
    services.includes('transport') ? 'Transport' : 'None';
};