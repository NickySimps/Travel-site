// Enhanced ShoppingCart.js implementation
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
    
    // Load cart from localStorage if available
    this.loadCart();
  }

  initialize() {
    console.log("Initializing shopping cart...");
    // Create the floating cart UI
    this.createCartUI();
    
    // Add event listeners
    this.setupEventListeners();
    
    // Set up event delegation for "Add to Cart" buttons
    this.setupAddToCartButtons();
    
    return this;
  }

  createCartUI() {
    // Create the floating cart button if it doesn't exist
    this.cartFloat = document.querySelector('.cart-float') || document.createElement('button');
    if (!this.cartFloat.classList.contains('cart-float')) {
      this.cartFloat.className = 'cart-float';
      this.cartFloat.innerHTML = '<i class="fa fa-shopping-cart"></i>';
      document.body.appendChild(this.cartFloat);
    }
    
    // Create cart count badge
    this.cartCount = this.cartFloat.querySelector('.cart-count') || document.createElement('span');
    if (!this.cartCount.classList.contains('cart-count')) {
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

  setupEventListeners() {
    // Cart float click to toggle panel
    this.cartFloat.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.cartPanel.style.transform = this.cartPanel.style.transform === 'scale(1)' ? 'scale(0)' : 'scale(1)';
      console.log("Cart panel toggled");
    });
    
    // Close cart panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.cartPanel.contains(e.target) && e.target !== this.cartFloat) {
        this.cartPanel.style.transform = 'scale(0)';
      }
    });

    // Checkout button functionality
    this.checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.items.length === 0) {
        alert('Your cart is empty');
        return;
      }
      
      this.showCheckoutForm();
    });
    
    // Fix for "Set Booking" button
    const confirmDatesBtn = document.getElementById('confirmDates');
    if (confirmDatesBtn) {
      confirmDatesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Set Booking button clicked, capturing event");
      });
    }
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
    
    // Special handler for booking confirmation button
    const confirmDatesBtn = document.getElementById('confirmDates');
    if (confirmDatesBtn) {
      confirmDatesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Get booking details from the calendar modal
        const packageId = window.currentPackage || '';
        const checkInDate = window.checkInDate;
        const checkOutDate = window.checkOutDate;
        
        if (!packageId || !checkInDate || !checkOutDate) {
          console.log("Missing booking details");
          return;
        }
        
        // Find property details
        let propertyName = packageId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        let basePrice = 0;
        
        // Try to find price from packagePrices object or from DOM
        try {
          if (window.packagePrices && window.packagePrices[packageId]) {
            basePrice = window.packagePrices[packageId].basePrice;
          } else {
            // Find price in DOM
            const packageElement = document.querySelector(`[data-package="${packageId}"]`);
            if (packageElement) {
              const priceElement = packageElement.closest('.package-box, .villa-card').querySelector('strong, .price');
              if (priceElement) {
                const priceText = priceElement.textContent;
                basePrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
              }
            }
          }
        } catch (error) {
          console.error("Error finding price:", error);
        }
        
        // Calculate total price
        const nights = Math.round(Math.abs((checkOutDate - checkInDate) / (24 * 60 * 60 * 1000)));
        const totalPrice = basePrice * nights;
        
        // Add to cart
        this.addToCart(
          `${propertyName} (${nights} nights)`,
          totalPrice,
          ''
        );
        
        // Close the calendar modal
        const calendarModal = document.getElementById('calendarModal');
        if (calendarModal) {
          calendarModal.classList.remove('active');
        }
        
        // Show confirmation
        alert(`${propertyName} has been added to your cart!`);
      });
    }
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
        <img class="cart-item-img" src="${item.imgSrc || './public/Pictures/villas/alhambra.jpg'}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover; margin-right: 10px;">
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
                <img src="${item.imgSrc || './public/Pictures/villas/alhambra.jpg'}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px;">
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
    
    modal.querySelector('.close-confirmation').addEventListener('click', (e) => {
      e.preventDefault();
      modal.remove();
      // Clear cart after successful order
      this.items = [];
      this.updateCart();
    });
  }
}

// Initialize the cart when the script loads
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded, initializing cart...");
  window.usviCart = new ShoppingCart().initialize();
  
  // Fix submission behaviors
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      // Prevent default form submission that causes page refresh
      e.preventDefault();
      console.log("Form submission prevented for:", form);
    });
  });
  
  // Fix for buttons inside forms
  document.querySelectorAll('button').forEach(button => {
    // Skip submit buttons
    if (button.type !== 'submit') {
      button.addEventListener('click', (e) => {
        e.preventDefault();
      });
    }
  });
  
  // Fix for the booking functionality
  const confirmDatesBtn = document.getElementById('confirmDates');
  if (confirmDatesBtn) {
    // Make global properties available
    window.currentPackage = '';
    window.checkInDate = null;
    window.checkOutDate = null;
    
    document.querySelectorAll('.booking-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        window.currentPackage = button.dataset.package;
        console.log("Current package set to:", window.currentPackage);
      });
    });
  }
});

export { ShoppingCart };