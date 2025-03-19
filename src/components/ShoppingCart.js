// ShoppingCart.js - Floating cart implementation
import { CONFIG } from './config.js';

class ShoppingCart {
  constructor() {
    this.items = [];
    this.cartFloat = null;
    this.cartPanel = null;
    this.cartCount = null;
    this.cartItems = null;
    this.totalAmount = null;
    this.checkoutBtn = null;
    
    // Load cart from localStorage if available
    this.loadCart();
  }

  initialize() {
    // Create the floating cart UI
    this.createCartUI();
    
    // Add event listeners
    this.setupEventListeners();
    
    // Set up event delegation for "Add to Cart" buttons
    this.setupAddToCartButtons();
    
    return this;
  }

  createCartUI() {
    // Create the floating cart button
    this.cartFloat = document.createElement('button');
    this.cartFloat.className = 'cart-float';
    this.cartFloat.innerHTML = '<i class="fa fa-shopping-cart"></i>';
    
    // Create cart count badge
    this.cartCount = document.createElement('span');
    this.cartCount.className = 'cart-count';
    this.cartCount.textContent = this.getTotalItems();
    this.cartFloat.appendChild(this.cartCount);
    
    // Create the cart panel
    this.cartPanel = document.createElement('div');
    this.cartPanel.className = 'cart-panel';
    
    // Create cart items container
    this.cartItems = document.createElement('div');
    this.cartItems.className = 'cart-items';
    this.cartPanel.appendChild(this.cartItems);
    
    // Create cart total
    const cartTotalDiv = document.createElement('div');
    cartTotalDiv.className = 'cart-total';
    cartTotalDiv.innerHTML = '<span>Total:</span>';
    this.totalAmount = document.createElement('span');
    this.totalAmount.className = 'total-amount';
    this.totalAmount.textContent = '$' + this.getCartTotal().toFixed(2);
    cartTotalDiv.appendChild(this.totalAmount);
    this.cartPanel.appendChild(cartTotalDiv);
    
    // Create checkout button
    this.checkoutBtn = document.createElement('button');
    this.checkoutBtn.className = 'checkout-btn';
    this.checkoutBtn.textContent = 'Checkout';
    this.cartPanel.appendChild(this.checkoutBtn);
    
    // Add to DOM
    document.body.appendChild(this.cartFloat);
    document.body.appendChild(this.cartPanel);
    
    // Add Font Awesome if not present
    this.addFontAwesome();
    
    // Update cart display
    this.updateCartDisplay();
  }

  addFontAwesome() {
    // Check if Font Awesome is already loaded, if not, add it
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const fontAwesome = document.createElement('link');
      fontAwesome.rel = 'stylesheet';
      fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
      document.head.appendChild(fontAwesome);
    }
  }

  setupEventListeners() {
    // Cart float click to toggle panel
    this.cartFloat.addEventListener('click', (e) => {
      e.stopPropagation();
      this.cartPanel.style.transform = this.cartPanel.style.transform === 'scale(1)' ? 'scale(0)' : 'scale(1)';
    });
    
    // Close cart panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.cartPanel.contains(e.target) && e.target !== this.cartFloat) {
        this.cartPanel.style.transform = 'scale(0)';
      }
    });

    // Checkout button functionality
    this.checkoutBtn.addEventListener('click', () => {
      if (this.items.length === 0) {
        alert('Your cart is empty');
        return;
      }
      
      this.showCheckoutForm();
    });
  }

  setupAddToCartButtons() {
    // Event delegation for "Add to Cart" buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-AddToCart') || 
          e.target.classList.contains('add-to-cart-btn') ||
          e.target.closest('.btn-AddToCart') ||
          e.target.closest('.add-to-cart-btn')) {
        
        e.preventDefault();
        const button = e.target.classList.contains('btn-AddToCart') || e.target.classList.contains('add-to-cart-btn') 
                      ? e.target 
                      : e.target.closest('.btn-AddToCart') || e.target.closest('.add-to-cart-btn');
        
        // Get product info from the button's data attributes
        const productName = button.dataset.itemName || 'Product';
        const productPrice = parseFloat(button.dataset.itemPrice || 0);
        const productImg = button.dataset.itemImage || '';
        
        // If product info is not in data attributes, try to get from parent container
        if (!button.dataset.itemName || !button.dataset.itemPrice) {
          const productBox = button.closest('.package-box') || 
                            button.closest('.service-package-box') || 
                            button.closest('.villa-card');
          
          if (productBox) {
            // Get product name
            const nameElement = productBox.querySelector('h3');
            if (nameElement && !productName) {
              productName = nameElement.textContent.trim();
            }
            
            // Get product price from various possible locations
            if (!productPrice) {
              // Try from strong element
              if (productBox.querySelector('p strong')) {
                const priceText = productBox.querySelector('p strong').textContent;
                productPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
              }
              // Try from a div with class price
              else if (productBox.querySelector('.price')) {
                const priceElement = productBox.querySelector('.price');
                const priceText = priceElement.textContent;
                productPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
              }
            }
            
            // Get product image
            const imgElement = productBox.querySelector('img');
            if (imgElement && !productImg) {
              productImg = imgElement.src;
            }
          }
        }
        
        // Add to cart
        this.addToCart(productName, productPrice, productImg);
      }
    });
  }

  addToCart(name, price, imgSrc) {
    // Check if item already exists in cart
    const existingItem = this.items.find(item => item.name === name);
    
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.subtotal = existingItem.quantity * existingItem.price;
    } else {
      this.items.push({
        name: name,
        price: price,
        imgSrc: imgSrc,
        quantity: 1,
        subtotal: price
      });
    }
    
    this.updateCart();
    
    // Visual feedback
    this.cartFloat.classList.add('pulse');
    setTimeout(() => this.cartFloat.classList.remove('pulse'), 500);
    
    // Show the cart panel briefly
    this.cartPanel.style.transform = 'scale(1)';
    setTimeout(() => this.cartPanel.style.transform = 'scale(0)', 3000);
  }

  updateCart() {
    // Save to localStorage
    localStorage.setItem('usviRetreatCart', JSON.stringify({
      items: this.items,
      total: this.getCartTotal()
    }));
    
    // Update display
    this.updateCartDisplay();
  }

  updateCartDisplay() {
    // Update count
    this.cartCount.textContent = this.getTotalItems();
    
    // Update total
    this.totalAmount.textContent = '$' + this.getCartTotal().toFixed(2);
    
    // Update items list
    this.cartItems.innerHTML = '';
    
    if (this.items.length === 0) {
      this.cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      return;
    }
    
    this.items.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      
      itemElement.innerHTML = `
        <img class="cart-item-img" src="${item.imgSrc || '/images/placeholder.jpg'}" alt="${item.name}">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
        </div>
        <button class="remove-item" data-index="${index}">×</button>
      `;
      
      this.cartItems.appendChild(itemElement);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(button.dataset.index);
        this.removeItem(index);
      });
    });
  }

  removeItem(index) {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
      this.updateCart();
    }
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0) || 0;
  }

  getCartTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  }

  loadCart() {
    const savedCart = localStorage.getItem('usviRetreatCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        this.items = parsedCart.items || [];
      } catch (e) {
        console.error('Error loading cart from localStorage:', e);
        this.items = [];
      }
    } else {
      this.items = [];
    }
  }
  
  showCheckoutForm() {
    // Create checkout modal
    const modal = document.createElement('div');
    modal.className = 'checkout-modal';
    
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
                <img src="${item.imgSrc || '/images/placeholder.jpg'}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px;">
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
    // Create order reference number
    const orderRef = 'USVI-' + Math.floor(Math.random() * 1000000);
    
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
        <p>Order reference: ${orderRef}</p>
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
    });
  }
  
  // Method to process bookings (from booking.js)
  processBooking(bookingDetails) {
    if (!bookingDetails || !bookingDetails.propertyId) {
      console.error('Invalid booking details');
      return false;
    }
    
    try {
      // Add booking to cart as a product
      this.addToCart(
        bookingDetails.propertyName || 'Property Booking',
        bookingDetails.total || 0,
        bookingDetails.imgSrc || ''
      );
      
      return true;
    } catch (error) {
      console.error('Error processing booking:', error);
      return false;
    }
  }
}

// Export a function to initialize the cart
export const initializeCart = () => {
  const cart = new ShoppingCart();
  cart.initialize();
  
  // Make cart globally accessible for other components
  window.usviCart = cart;
  
  return cart;
};

// Handle integration with booking system
export const processBooking = (bookingDetails) => {
  if (window.usviCart) {
    return window.usviCart.processBooking(bookingDetails);
  }
  return false;
};