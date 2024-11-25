class ShoppingCart {
    constructor() {
        this.items = [];

        // Get DOM elements using functions
        this.cart = this.getCartElement();
        this.cartItems = this.getCartItemsElement();
        this.cartCount = this.getCartCountElement();
        this.totalAmount = this.getTotalAmountElement();
        this.checkoutBtn = this.getCheckoutBtnElement();

        this.initialize();
    }

    // Function to get the cart element
    getCartElement() {
        return document.querySelector('.floating-cart');
    }

    // Function to get the cart items element
    getCartItemsElement() {
        return this.cart.querySelector('.cart-items');
    }

    // Function to get the cart count element
    getCartCountElement() {
        return this.cart.querySelector('.cart-count');
    }

    // Function to get the total amount element
    getTotalAmountElement() {
        return this.cart.querySelector('.total-amount');
    }

    // Function to get the checkout button element
    getCheckoutBtnElement() {
        return this.cart.querySelector('.checkout-btn');
    }

    
  
    initialize() {
        // Add click handlers to all "Add to cart" buttons
        document.querySelectorAll('.btn-AddToCart').forEach(button => {
            button.addEventListener('click', (e) => {
                const packageBox = e.target.closest('.package-box');
                const packageName = packageBox.querySelector('h3').textContent;
                const packagePrice = packageBox.querySelector('strong').textContent;
                this.addItem(packageName, packagePrice);
            });
        });
  
        // Initialize cart visibility
        this.updateCartVisibility();
  
        // Add checkout button handler
        this.checkoutBtn.addEventListener('click', () => {
            if (this.items.length > 0) {
                alert('Proceeding to checkout with total: $' + this.calculateTotal());
                // Add actual checkout logic here
            }
        });
    }
    
  
    addItem(name, price) {
        const priceValue = parseFloat(price.replace(/[^0-9.]/g, ''));
        const item = {
            id: Date.now(), // Unique ID for each item
            name: name,
            price: priceValue
        };
  
        this.items.push(item);
        this.renderCartItem(item);
        this.updateCart();
    }
  
    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.updateCart();
    }
  
    renderCartItem(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-details">
                <div>${item.name}</div>
                <div>$${item.price}</div>
            </div>
            <span class="remove-item" data-id="${item.id}">×</span>
        `;
  
        itemElement.querySelector('.remove-item').addEventListener('click', () => {
            this.removeItem(item.id);
        });
  
        this.cartItems.appendChild(itemElement);
    }
  
    calculateTotal() {
        return this.items.reduce((total, item) => total + item.price, 0).toFixed(2);
    }
  
    updateCart() {
        // Update cart count
        this.cartCount.textContent = this.items.length;
        
        // Update total amount
        this.totalAmount.textContent = this.calculateTotal();
        
        // Clear and re-render all items
        this.cartItems.innerHTML = '';
        this.items.forEach(item => this.renderCartItem(item));
        
        // Update cart visibility
        this.updateCartVisibility();
    }
  
    updateCartVisibility() {
        if (this.items.length === 0) {
            this.cart.classList.add('empty');
        } else {
            this.cart.classList.remove('empty');
        }
    }
  }
  // Initialize the shopping cart when the DOM is loaded
const cart = new ShoppingCart(); // Create the ShoppingCart instance

document.addEventListener('DOMContentLoaded', () => {
  cart.initialize(); // Call initialize after DOM is loaded
});

