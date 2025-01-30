import { CONFIG } from './config.js';

export const initializeCart = () => {
  if (window.SnipcartSettings) return; // Prevent duplicate initialization
  
  window.SnipcartSettings = {
    publicApiKey: CONFIG.SNIPCART.PUBLIC_KEY,
    loadStrategy: 'on-user-interaction',
    modalStyle: "side"
  };

  // Load Snipcart resources
  const script = document.createElement('script');
  script.src = CONFIG.SNIPCART.SCRIPT_URL;
  document.head.appendChild(script);

  const link = document.createElement('link');
  link.rel = "stylesheet";
  link.href = CONFIG.SNIPCART.CSS_URL;
  document.head.appendChild(link);
};

  window.addEventListener('snipcart.ready', () => {
    // Now Snipcart is guaranteed to be loaded
    const cartButton = document.createElement('button');
    const openCartButton = document.getElementById('open-cart-btn');
    cartButton.classList.add('snipcart-checkout');
    cartButton.textContent = 'Cart';
    document.querySelector('header').appendChild(cartButton);
    
    console.log('Snipcart ready');
    Snipcart.events.on('item.adding', (item) => {
      console.log('Adding item:', item);
    });
    Snipcart.events.on('item.added', (item) => {
      console.log('Item added:', item);
    });
    Snipcart.events.on('cart.ready', (cart) => {
      console.log('Cart ready:', cart);
    });
    
  
    if (cartButton.hasChildNodes()) 
    {
    openCartButton.style.display = cartButton.hasChildNodes() ? 'block' : 'none';
    
  }
});
