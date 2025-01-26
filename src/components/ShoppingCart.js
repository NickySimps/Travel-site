export const initializeSnipcart = () => {
    const cartButton = document.createElement('button');
    cartButton.classList.add('snipcart-checkout');
    cartButton.textContent = 'Cart';
    document.querySelector('header').appendChild(cartButton);
  
    ['item.adding', 'item.added', 'cart.ready'].forEach((event) => {
      Snipcart.events.on(event, (data) => console.log(event, data));
    });
  };