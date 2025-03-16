export class CustomCart {
    constructor() {
      this.items = [];
      this.cartElement = null;
      this.cartCount = null;
      this.cartDropdown = null;
      this.isOpen = false;
      
      // Load cart from localStorage if available
      this.loadCart();
    }
  
    initialize() {
      // Create the floating cart UI
      this.createCartUI();
      
      // Add event listeners to "Add to Cart" buttons
      document.querySelectorAll('.btn-AddToCart').forEach(button => {
        button.classList.remove('snipcart-add-item');
        button.addEventListener('click', (event) => {
          event.preventDefault();
          
          const item = {
            id: button.dataset.itemId,
            name: button.dataset.itemName,
            price: parseFloat(button.dataset.itemPrice),
            image: button.dataset.itemImage || '',
            description: button.dataset.itemDescription || '',
            quantity: 1
          };
          
          this.addItem(item);
        });
      });
    }
  
    createCartUI() {
      // Create the floating cart icon
      this.cartElement = document.createElement('div');
      this.cartElement.className = 'floating-cart';
      
      // Create the cart icon
      const cartIcon = document.createElement('div');
      cartIcon.className = 'cart-icon';
      cartIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      `;
      
      // Create the cart count badge
      this.cartCount = document.createElement('span');
      this.cartCount.className = 'cart-count';
      this.cartCount.textContent = this.getTotalItems();
      
      // Create the cart dropdown
      this.cartDropdown = document.createElement('div');
      this.cartDropdown.className = 'cart-dropdown';
      
      // Add elements to the DOM
      cartIcon.appendChild(this.cartCount);
      this.cartElement.appendChild(cartIcon);
      this.cartElement.appendChild(this.cartDropdown);
      document.body.appendChild(this.cartElement);
      
      // Add click event to toggle cart dropdown
      cartIcon.addEventListener('click', () => this.toggleCart());
      
      // Update the cart dropdown content
      this.updateCartDropdown();
      
      // Add styles to the document
      this.addCartStyles();
    }
  
    addCartStyles() {
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .floating-cart {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }
        
        .cart-icon {
          width: 60px;
          height: 60px;
          background-color: #87ceeb;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          position: relative;
        }
        
        .cart-icon:hover {
          background-color: #ffdda9;
          transform: scale(1.05);
        }
        
        .cart-icon svg {
          color: white;
        }
        
        .cart-count {
          position: absolute;
          top: 0;
          right: 0;
          background-color: #ff6b6b;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          font-weight: bold;
        }
        
        .cart-dropdown {
          position: absolute;
          bottom: 70px;
          right: 0;
          width: 300px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          padding: 15px;
          display: none;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .cart-dropdown.open {
          display: block;
        }
        
        .cart-item {
          display: flex;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }
        
        .cart-item-image {
          width: 60px;
          height: 60px;
          border-radius: 5px;
          overflow: hidden;
          margin-right: 10px;
        }
        
        .cart-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .cart-item-details {
          flex-grow: 1;
        }
        
        .cart-item-name {
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .cart-item-price {
          color: #87ceeb;
          font-weight: bold;
        }
        
        .cart-item-quantity {
          display: flex;
          align-items: center;
          margin-top: 5px;
        }
        
        .quantity-btn {
          width: 24px;
          height: 24px;
          background-color: #f5f5f5;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .quantity-btn:hover {
          background-color: #e0e0e0;
        }
        
        .item-quantity {
          width: 30px;
          text-align: center;
          margin: 0 5px;
        }
        
        .cart-footer {
          margin-top: 15px;
          text-align: center;
        }
        
        .cart-total {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          margin-bottom: 15px;
          padding-top: 15px;
          border-top: 2px solid #eee;
        }
        
        .checkout-btn {
          display: block;
          width: 100%;
          padding: 10px 15px;
          background-color: #87ceeb;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s ease;
        }
        
        .checkout-btn:hover {
          background-color: #ffdda9;
        }
        
        .empty-cart-message {
          text-align: center;
          padding: 20px 0;
          color: #888;
        }
        
        .remove-item {
          background: none;
          border: none;
          color: #ff6b6b;
          cursor: pointer;
          font-size: 12px;
          margin-top: 5px;
        }
        
        .remove-item:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 768px) {
          .cart-dropdown {
            width: 280px;
            max-height: 350px;
            right: 0;
          }
        }
      `;
      document.head.appendChild(styleElement);
    }
  
    toggleCart() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.cartDropdown.classList.add('open');
      } else {
        this.cartDropdown.classList.remove('open');
      }
    }
  
    updateCartDropdown() {
      if (!this.cartDropdown) return;
      
      if (this.items.length === 0) {
        this.cartDropdown.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        return;
      }
      
      let cartHTML = '';
      
      // Create cart items HTML
      this.items.forEach((item, index) => {
        cartHTML += `
          <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">$${item.price.toFixed(2)}</div>
              <div class="cart-item-quantity">
                <button class="quantity-btn decrease-quantity" data-index="${index}">-</button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="quantity-btn increase-quantity" data-index="${index}">+</button>
                <button class="remove-item" data-index="${index}">Remove</button>
              </div>
            </div>
          </div>
        `;
      });
      
      // Add cart footer with total and checkout button
      const total = this.getCartTotal();
      cartHTML += `
        <div class="cart-footer">
          <div class="cart-total">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
          </div>
          <button class="checkout-btn">Proceed to Checkout</button>
        </div>
      `;
      
      this.cartDropdown.innerHTML = cartHTML;
      
      // Add event listeners to quantity buttons
      this.cartDropdown.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', () => {
          const index = parseInt(button.dataset.index);
          this.decreaseQuantity(index);
        });
      });
      
      this.cartDropdown.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', () => {
          const index = parseInt(button.dataset.index);
          this.increaseQuantity(index);
        });
      });
      
      this.cartDropdown.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
          const index = parseInt(button.dataset.index);
          this.removeItem(index);
        });
      });
      
      // Add checkout button event
      this.cartDropdown.querySelector('.checkout-btn').addEventListener('click', () => {
        this.checkout();
      });
    }
  
    addItem(newItem) {
      // Check if item already exists in cart
      const existingItemIndex = this.items.findIndex(item => item.id === newItem.id);
      
      if (existingItemIndex >= 0) {
        // Increase quantity if item already exists
        this.items[existingItemIndex].quantity += 1;
      } else {
        // Add new item to cart
        this.items.push(newItem);
      }
      
      // Update the UI
      this.updateCart();
      
      // Show a confirmation message
      this.showAddedToCartMessage(newItem.name);
    }
  
    showAddedToCartMessage(itemName) {
      // Create and show a temporary message
      const message = document.createElement('div');
      message.className = 'added-to-cart-message';
      message.textContent = `${itemName} added to cart`;
      message.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
      `;
      
      document.body.appendChild(message);
      
      // Fade in
      setTimeout(() => {
        message.style.opacity = '1';
      }, 10);
      
      // Fade out and remove
      setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => {
          message.remove();
        }, 300);
      }, 2000);
    }
  
    removeItem(index) {
      if (index >= 0 && index < this.items.length) {
        this.items.splice(index, 1);
        this.updateCart();
      }
    }
  
    increaseQuantity(index) {
      if (index >= 0 && index < this.items.length) {
        this.items[index].quantity += 1;
        this.updateCart();
      }
    }
  
    decreaseQuantity(index) {
      if (index >= 0 && index < this.items.length) {
        if (this.items[index].quantity > 1) {
          this.items[index].quantity -= 1;
        } else {
          // Remove item if quantity would become 0
          this.removeItem(index);
        }
        this.updateCart();
      }
    }
  
    updateCart() {
      // Update the cart count
      if (this.cartCount) {
        this.cartCount.textContent = this.getTotalItems();
      }
      
      // Update the cart dropdown
      this.updateCartDropdown();
      
      // Save cart to localStorage
      this.saveCart();
    }
  
    getTotalItems() {
      return this.items.reduce((total, item) => total + item.quantity, 0);
    }
  
    getCartTotal() {
      return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  
    saveCart() {
      localStorage.setItem('usviRetreatCart', JSON.stringify(this.items));
    }
  
    loadCart() {
      const savedCart = localStorage.getItem('usviRetreatCart');
      if (savedCart) {
        try {
          this.items = JSON.parse(savedCart);
        } catch (e) {
          console.error('Error loading cart from localStorage:', e);
          this.items = [];
        }
      }
    }
  
    checkout() {
      // Replace with your checkout logic
      alert('Proceeding to checkout with ' + this.getTotalItems() + ' items worth $' + this.getCartTotal().toFixed(2));
      
      // For demonstration, let's create a simple checkout form
      this.showCheckoutForm();
    }
  
    showCheckoutForm() {
      // Create checkout modal
      const modal = document.createElement('div');
      modal.className = 'checkout-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
      `;
      
      // Create checkout form content
      const checkoutForm = `
        <div class="checkout-form" style="
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        ">
          <h2 style="margin-top: 0;">Checkout</h2>
          <div class="checkout-items" style="margin-bottom: 20px;">
            <h3>Order Summary</h3>
            ${this.items.map(item => `
              <div style="display: flex; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                <div style="width: 50px; height: 50px; margin-right: 10px;">
                  <img src="${item.image}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px;">
                </div>
                <div>
                  <div style="font-weight: bold;">${item.name}</div>
                  <div>$${item.price.toFixed(2)} x ${item.quantity}</div>
                </div>
                <div style="margin-left: auto; font-weight: bold;">
                  $${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            `).join('')}
            <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 15px; padding-top: 15px; border-top: 2px solid #eee;">
              <span>Total:</span>
              <span>$${this.getCartTotal().toFixed(2)}</span>
            </div>
          </div>
          <form id="checkout-form">
            <div style="margin-bottom: 15px;">
              <label for="checkout-name" style="display: block; margin-bottom: 5px;">Full Name</label>
              <input id="checkout-name" type="text" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="margin-bottom: 15px;">
              <label for="checkout-email" style="display: block; margin-bottom: 5px;">Email</label>
              <input id="checkout-email" type="email" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="margin-bottom: 15px;">
              <label for="checkout-phone" style="display: block; margin-bottom: 5px;">Phone</label>
              <input id="checkout-phone" type="tel" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="margin-bottom: 15px;">
              <label for="checkout-address" style="display: block; margin-bottom: 5px;">Address</label>
              <textarea id="checkout-address" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; min-height: 80px;"></textarea>
            </div>
            <div style="margin-bottom: 15px;">
              <label for="checkout-payment" style="display: block; margin-bottom: 5px;">Payment Method</label>
              <select id="checkout-payment" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                <option value="">Select Payment Method</option>
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
              <button type="button" class="cancel-checkout" style="
                padding: 10px 20px;
                background-color: #f5f5f5;
                border: none;
                border-radius: 5px;
                cursor: pointer;
              ">Cancel</button>
              <button type="submit" style="
                padding: 10px 20px;
                background-color: #87ceeb;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
              ">Complete Order</button>
            </div>
          </form>
        </div>
      `;
      
      modal.innerHTML = checkoutForm;
      document.body.appendChild(modal);
      
      // Add event listeners
      modal.querySelector('.cancel-checkout').addEventListener('click', () => {
        modal.remove();
      });
      
      modal.querySelector('#checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        this.completeOrder(modal);
      });
    }
  
    completeOrder(modal) {
      // Show order confirmation
      modal.innerHTML = `
        <div style="
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          width: 90%;
          max-width: 500px;
          text-align: center;
        ">
          <h2>Thank You!</h2>
          <p>Your order has been placed successfully.</p>
          <p>We've sent a confirmation email with your order details.</p>
          <p>Order reference: USVI-${Math.floor(Math.random() * 1000000)}</p>
          <button class="close-confirmation" style="
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #87ceeb;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">Close</button>
        </div>
      `;
      
      modal.querySelector('.close-confirmation').addEventListener('click', () => {
        modal.remove();
        // Clear cart after successful order
        this.items = [];
        this.updateCart();
        this.toggleCart();
      });
    }
  }
  
  // Export a function to initialize the cart
  export const initializeCustomCart = () => {
    const cart = new CustomCart();
    cart.initialize();
    
    // Replace header cart button with custom implementation
    const headerCartBtn = document.querySelector('nav .snipcart-checkout');
    if (headerCartBtn) {
      headerCartBtn.classList.remove('snipcart-checkout');
      headerCartBtn.addEventListener('click', () => {
        // Find the floating cart and trigger a click
        const floatingCart = document.querySelector('.cart-icon');
        if (floatingCart) {
          floatingCart.click();
        }
      });
    }
    
    // Remove Snipcart div if it exists
    const snipcartDiv = document.getElementById('snipcart');
    if (snipcartDiv) {
      snipcartDiv.remove();
    }
    
    return cart;
  };