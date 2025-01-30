import { CONFIG } from './config.js';

export const initializeCart = () => {
    window.SnipcartSettings = {
      publicApiKey: 'ZjFmOWZjNDUtM2VmMC00ZmExLTkzMTctMjExM2UzZDcwZjI3NjM4Njg4Nzc3OTMyNzM5MTQ3',
      loadStrategy: 'on-user-interaction',
      modalStyle: "side",
      protocol: 'https',
      domain: 'cdn.snipcart.com'

      
    };
  };

  const script = document.createElement('script');
  script.src = "https://cdn.snipcart.com/themes/v3.0/default/snipcart.js";
  document.body.appendChild(script);

  const link = document.createElement('link');
  link.rel = "stylesheet";
  link.href = "https://cdn.snipcart.com/themes/v3.0/default/snipcart.css";
  document.head.appendChild(link);

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
