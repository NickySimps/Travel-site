// Updated ShoppingCart.js implementation with fixes
// Save this file to src/components/ShoppingCart.js

class ShoppingCart {
  constructor() {
    this.items = [];
    this.cartFloat = null;
    this.cartPanel = null;
    this.cartCount = null;
    this.cartItems = null;
    this.totalAmount = null;
    this.checkoutBtn = null;

    this.isMouseOverCart = false; // Tracks if mouse is over cart elements
    this.hideTimeout = null;      // Timeout ID for hiding panel
    
    // Load cart from localStorage if available
    this.loadCart();
  }

  initialize() {
    console.log("Initializing shopping cart...");
    // Create the floating cart UI
    this.createCartUI();
    
    // Add event listeners
    this.setupEventListeners();
    
    // Add icons to existing cart-checkout buttons in the DOM
    document.querySelectorAll('.cart-checkout').forEach(button => {
        // Check if it's a simple "Cart" button and doesn't already have an icon
        if (button.textContent.trim().toLowerCase() === 'cart' && !button.querySelector('i.fa, i.fas')) {
            button.innerHTML = '<i class="fas fa-shopping-cart"></i> Cart';
        }
    });
    
    // Set up event delegation for "Add to Cart" buttons
    this.setupAddToCartButtons();
    
    return this;
  }

  createCartUI() {
    // Create the floating cart button if it doesn't exist
    this.cartFloat = document.querySelector('.cart-float') || document.createElement('button');
    if (!this.cartFloat.classList.contains('cart-float')) {
      this.cartFloat.className = 'cart-float';
      this.cartFloat.innerHTML = '<i class="fa fa-shopping-cart"></i><span class="cart-count">0</span>';
      document.body.appendChild(this.cartFloat);
    }
    
    // Create cart count badge
    this.cartCount = this.cartFloat.querySelector('.cart-count');
    if (!this.cartCount) {
      this.cartCount = document.createElement('span');
      this.cartCount.className = 'cart-count';
      this.cartFloat.appendChild(this.cartCount);
    }
    this.cartCount.textContent = this.getTotalItems();
    
    // Create the cart panel if it doesn't exist
    this.cartPanel = document.querySelector('.cart-panel') || document.createElement('div');
    if (!this.cartPanel.classList.contains('cart-panel')) {
      this.cartPanel.className = 'cart-panel';
      document.body.appendChild(this.cartPanel);
    }
    
    // Create cart items container if it doesn't exist
    this.cartItems = this.cartPanel.querySelector('.cart-items') || document.createElement('div');
    if (!this.cartItems.classList.contains('cart-items')) {
      this.cartItems.className = 'cart-items';
      this.cartPanel.appendChild(this.cartItems);
    }
    
    // Create cart total if it doesn't exist
    let cartTotalDiv = this.cartPanel.querySelector('.cart-total');
    if (!cartTotalDiv) {
      cartTotalDiv = document.createElement('div');
      cartTotalDiv.className = 'cart-total';
      cartTotalDiv.innerHTML = '<span>Total:</span>';
      this.totalAmount = document.createElement('span');
      this.totalAmount.className = 'total-amount';
      cartTotalDiv.appendChild(this.totalAmount);
      this.cartPanel.appendChild(cartTotalDiv);
    } else {
      this.totalAmount = cartTotalDiv.querySelector('.total-amount');
    }
    this.totalAmount.textContent = '$' + this.getCartTotal().toFixed(2);
    
    // Create checkout button if it doesn't exist
    this.checkoutBtn = this.cartPanel.querySelector('.checkout-btn') || document.createElement('button');
    if (!this.checkoutBtn.classList.contains('checkout-btn')) {
      this.checkoutBtn.className = 'checkout-btn';
      this.checkoutBtn.textContent = 'Checkout';
      this.cartPanel.appendChild(this.checkoutBtn);
    }
    
    // Add Font Awesome if not present
    this.addFontAwesome();
    
    // Update cart display
    this.updateCartDisplay();
    
    console.log("Cart UI created");
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

  showPanel() {
    clearTimeout(this.hideTimeout);
    if (this.cartPanel) {
      this.cartPanel.classList.add('open');
      this.cartPanel.style.transform = 'scale(1)';
    }
  }

  hidePanel(useDelay = true) {
    const performHide = () => {
      if (!this.isMouseOverCart && this.cartPanel) {
        this.cartPanel.classList.remove('open');
        this.cartPanel.style.transform = 'scale(0)';
      }
    };

    clearTimeout(this.hideTimeout);
    if (useDelay) {
      this.hideTimeout = setTimeout(performHide, 300);
    } else {
      performHide();
    }
  }

  togglePanel() {
    if (this.cartPanel) {
      if (this.cartPanel.classList.contains('open')) {
        this.isMouseOverCart = false; // Force close intent
        this.hidePanel(false);
      } else {
        this.isMouseOverCart = true; // Assume intent to open and keep open
        this.showPanel();
      }
    }
  }

  setupEventListeners() {
    // --- Cart Float (the floating button) ---
    if (this.cartFloat) {
      this.cartFloat.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.togglePanel();
      });

      this.cartFloat.addEventListener('mouseenter', () => {
        this.isMouseOverCart = true;
        this.showPanel();
      });

      this.cartFloat.addEventListener('mouseleave', () => {
        this.isMouseOverCart = false;
        this.hidePanel(true);
      });
    }

    // --- Cart Panel (the dropdown/slide-out) ---
    if (this.cartPanel) {
      this.cartPanel.addEventListener('mouseenter', () => {
        this.isMouseOverCart = true;
        clearTimeout(this.hideTimeout);
      });

      this.cartPanel.addEventListener('mouseleave', () => {
        this.isMouseOverCart = false;
        this.hidePanel(true);
      });
    }
    
    // --- Navbar Cart Buttons ('.cart-checkout' or '.custom-cart-toggle') ---
    const navCartButtons = document.querySelectorAll('.cart-checkout, header nav ul button.custom-cart-toggle');
    navCartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.togglePanel();
      });

      button.addEventListener('mouseenter', () => {
        this.isMouseOverCart = true;
        this.showPanel();
      });

      button.addEventListener('mouseleave', () => {
        this.isMouseOverCart = false;
        this.hidePanel(true);
      });
    });
    
    // --- Close cart panel when clicking outside ---
    document.addEventListener('click', (e) => {
      if (this.cartPanel && this.cartPanel.classList.contains('open')) {
        const isClickInsideCartFloat = this.cartFloat && this.cartFloat.contains(e.target);
        const isClickInsideCartPanel = this.cartPanel.contains(e.target);
        const isClickOnNavButton = e.target.closest('.cart-checkout, header nav ul button.custom-cart-toggle');

        if (!isClickInsideCartFloat && !isClickInsideCartPanel && !isClickOnNavButton) {
          this.isMouseOverCart = false;
          this.hidePanel(false); // Hide immediately
        }
      }
    });
  
    // --- Checkout Button (inside the cart panel) ---
    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.items.length === 0) {
          alert('Your cart is empty');
          return;
        }
        this.showCheckoutForm();
      });
    }
    
    // Remove any hover-based cart opening from CSS by adding inline style
    // This ensures our JS-controlled hover logic takes precedence.
    const style = document.createElement('style');
    style.textContent = `
      .cart-float:hover + .cart-panel, /* In case CSS tries to show panel on float hover */
      .cart-panel:hover { /* In case CSS tries to keep panel open on its own hover */
        transform: none !important; /* Override CSS hover effects for transform */
        /* Add other properties if CSS hover affects them, e.g., visibility, display */
      }
    `;
    document.head.appendChild(style);
  }

  setupAddToCartButtons() {
    // First, handle all existing cart-add-item buttons
    document.querySelectorAll('.cart-add-item, .btn-AddToCart').forEach(button => {
      // Remove existing event listeners by cloning and replacing
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      newButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Add to cart button clicked:", newButton);
        
        // Get product info from the button's data attributes
        const productId = newButton.dataset.itemId || 'product-' + Date.now();
        const productName = newButton.dataset.itemName || 'Product';
        const productPrice = parseFloat(newButton.dataset.itemPrice || 0);
        const productImg = newButton.dataset.itemImage || '';
        
        // Add to cart
        this.addToCart(productName, productPrice, productImg);
      });
    });
    
    // Event delegation for dynamically added buttons
    document.addEventListener('click', (e) => {
      // Target cart-add-item and btn-AddToCart classes
      const button = e.target.closest('.cart-add-item, .btn-AddToCart');
      
      if (button) {
        // Check if this click was already handled by the direct listeners above
        // This is a simple check; more robust solutions might involve flags or checking event path.
        if (e.target !== button) { // If the click was on a child of the button
          // Potentially do nothing if the direct listener on `button` already fired.
          // However, current setup replaces buttons, so direct listeners are on new cloned buttons.
          // This delegated listener will catch clicks on original buttons if not properly replaced,
          // or on buttons added after initial setup.
        }

        e.preventDefault();
        e.stopPropagation();
        console.log("Cart button clicked via delegation:", button);
        
        // Get product info from the button's data attributes
        const productId = button.dataset.itemId || 'product-' + Date.now();
        const productName = button.dataset.itemName || 'Product';
        const productPrice = parseFloat(button.dataset.itemPrice || 0);
        const productImg = button.dataset.itemImage || '';
        
        // Add to cart
        this.addToCart(productName, productPrice, productImg);
      }
    });
  }

  addToCart(name, price, imgSrc) {
    console.log("Adding to cart:", name, price, imgSrc);
    
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
    if (this.cartFloat) {
      this.cartFloat.classList.add('pulse');
      setTimeout(() => this.cartFloat.classList.remove('pulse'), 500);
    }
    
    // Show the cart panel briefly for visual feedback
    this.isMouseOverCart = true; // Temporarily set to true to allow showPanel
    this.showPanel();
    setTimeout(() => {
      // Only close if mouse is not over cart elements after the feedback duration
      this.isMouseOverCart = false;
      this.hidePanel(true); // Attempt to hide with delay, respecting mouse position
    }, 3000);
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
    if (this.cartCount) {
      this.cartCount.textContent = this.getTotalItems();
    }
    
    // Update total
    if (this.totalAmount) {
      this.totalAmount.textContent = '$' + this.getCartTotal().toFixed(2);
    }
    
    // Update items list
    this.cartItems.innerHTML = '';
    
    if (this.items.length === 0) {
      this.cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      return;
    }
    
    this.items.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      
      // Use a default image if none is provided
const imgSrc = item.imgSrc || `./public/Pictures/villas/${item.name}.jpg`;
      
      itemElement.innerHTML = `
        <div style="width: 40px; height: 40px; margin-right: 10px;">
          <img src="${imgSrc}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px;">
        </div>
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
        e.preventDefault();
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
    // Create checkout modal if it doesn't exist
    let modal = document.querySelector('.checkout-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'checkout-modal';
      document.body.appendChild(modal);
    }
    
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
                <img src="${item.imgSrc || `./public/Pictures/villas/${item.name}.jpg`}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px;">
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
    
    // Add event listeners
    modal.querySelector('.cancel-checkout').addEventListener('click', (e) => {
      e.preventDefault();
      modal.remove();
    });
    
    modal.querySelector('#checkout-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.completeOrder(modal);
    });

    // Show the modal by setting display style
    modal.style.display = 'flex';
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
        position: relative;
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
    
    modal.querySelector('.close-confirmation').addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'none';
      // Clear cart after successful order
      this.items = [];
      this.updateCart();
    });
  }
}

export { ShoppingCart }; 