export class CustomCart {
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
    
    return this;
  }

  createCartUI() {
    // Create the floating cart button - position LEFT instead of right
    this.cartFloat = document.createElement('button');
    this.cartFloat.className = 'cart-float';
    this.cartFloat.innerHTML = '<i class="fa fa-shopping-cart"></i>';
    this.cartFloat.style.left = '20px'; // Position left instead of right
    this.cartFloat.style.right = 'auto'; // Remove right positioning
    
    // Create cart count badge
    this.cartCount = document.createElement('span');
    this.cartCount.className = 'cart-count';
    this.cartCount.textContent = this.getTotalItems();
    this.cartFloat.appendChild(this.cartCount);
    
    // Create the cart panel - position LEFT instead of right
    this.cartPanel = document.createElement('div');
    this.cartPanel.className = 'cart-panel';
    this.cartPanel.style.left = '20px'; // Position left instead of right
    this.cartPanel.style.right = 'auto'; // Remove right positioning
    this.cartPanel.style.transformOrigin = 'bottom left'; // Change transform origin
    
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
    this.updateCartDropdown();
    
    // Ensure back-to-top button is visible when needed
    this.ensureBackToTopButton();
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
  
  ensureBackToTopButton() {
    // Check if back-to-top button exists
    let backToTopBtn = document.getElementById('backToTop');
    
    // If it doesn't exist, create it
    if (!backToTopBtn) {
      backToTopBtn = document.createElement('button');
      backToTopBtn.id = 'backToTop';
      backToTopBtn.title = 'Go to top';
      backToTopBtn.textContent = '↑';
      document.body.appendChild(backToTopBtn);
      
      // Add event listener
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    
    // Make sure it's visible on scroll
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'block';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });
    
    // Initial check
    if (window.pageYOffset > 300) {
      backToTopBtn.style.display = 'block';
    } else {
      backToTopBtn.style.display = 'none';
    }
  }

  setupEventListeners() {
    // Cart float click to toggle panel
    this.cartFloat.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.cartPanel.style.transform === 'scale(1)') {
        this.cartPanel.style.transform = 'scale(0)';
      } else {
        this.cartPanel.style.transform = 'scale(1)';
      }
    });
    
    // Close cart panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.cartPanel.contains(e.target) && e.target !== this.cartFloat) {
        this.cartPanel.style.transform = 'scale(0)';
      }
    });
    
    // Event delegation for "Add to Cart" buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-AddToCart') || 
          e.target.classList.contains('add-to-cart-btn') ||
          e.target.classList.contains('snipcart-add-item')) {
        
        e.preventDefault();
        
        // Get product info from the closest parent product container
        const productBox = e.target.closest('.package-box') || 
                          e.target.closest('.service-package-box') || 
                          e.target.closest('.villa-card');
        
        if (!productBox) return;
        
        // Get product name
        const nameElement = productBox.querySelector('h3');
        const productName = nameElement ? nameElement.textContent : 'Product';
        
        // Get product price from various possible locations
        let productPrice = 0;
        
        // Try from button data attribute first
        if (e.target.dataset.itemPrice) {
          productPrice = parseFloat(e.target.dataset.itemPrice);
        }
        // Then try from strong element
        else if (productBox.querySelector('p strong')) {
          const priceText = productBox.querySelector('p strong').textContent;
          productPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        }
        // Try from a div with class price
        else if (productBox.querySelector('.price')) {
          const priceElement = productBox.querySelector('.price');
          const priceText = priceElement.textContent;
          productPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        }
        // Fallback to data-price attribute
        else if (productBox.querySelector('[data-price]')) {
          productPrice = parseFloat(productBox.querySelector('[data-price]').dataset.price);
        }
        
        // Get product image
        const imgElement = productBox.querySelector('img');
        const productImg = imgElement ? imgElement.src : '';
        
        // Add to cart
        this.addToCart(productName, productPrice, productImg);
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
    // Recalculate total
    this.cart = {
      items: this.items,
      total: this.items.reduce((sum, item) => sum + item.subtotal, 0)
    };
    
    // Save to localStorage
    localStorage.setItem('usviRetreatCart', JSON.stringify(this.cart));
    
    // Update display
    this.updateCartDisplay();
  }

  updateCartDisplay() {
    // Update count
    this.cartCount.textContent = this.cart.items.reduce((count, item) => count + item.quantity, 0);
    
    // Update total
    this.totalAmount.textContent = '$' + this.cart.total.toFixed(2);
    
    // Update items list
    this.cartItems.innerHTML = '';
    
    if (this.cart.items.length === 0) {
      this.cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      return;
    }
    
    this.cart.items.forEach((item, index) => {
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
    if (index >= 0 && index < this.cart.items.length) {
      this.cart.items.splice(index, 1);
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
        this.cart = JSON.parse(savedCart);
        this.items = this.cart.items || [];
      } catch (e) {
        console.error('Error loading cart from localStorage:', e);
        this.cart = { items: [], total: 0 };
        this.items = [];
      }
    } else {
      this.cart = { items: [], total: 0 };
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
      this.cart.items = [];
      this.cart.total = 0;
      this.updateCart();
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
      const floatingCart = document.querySelector('.cart-float');
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