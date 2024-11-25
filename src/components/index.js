// Constants
const brandingText = 'Virgin Islands Travel';
const showcaseHeader = 'Visit Paradise';
const showcaseParagraph = 'Explore new adventures';
const missionStatement = 'Find your own little slice of paradise in our tropical haven, where lush green hills meet turquoise waters, and the scent of blooming flowers fills the air with promise.';
const newsletterForm = {
  firstName: { placeholder: 'First Name', required: true },
  lastName: { placeholder: 'Last Name', required: true },
  phone: { placeholder: 'Phone Number', required: true },
  email: { placeholder: 'Enter email', required: true }
};
const footerText = 'Virgin Islands site, Copyright &copy; 2024';

// Let declarations
let navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Packages', href: '#packages' },
  { name: 'Groups', href: '#groups' },
  { name: 'Accommodations', href: 'accomodations.html' },
  { name: 'Virgin Islands', href: 'virginsislands.html' },
  { name: 'About', href: 'about.html' },
  { name: 'Login', href: '#login' }
];
let packages = [
  {
    name: 'Friends Package',
    description: 'Perfect for group getaways',
    price: '$500 per person',
    buttonLabel: 'Add to cart',
    flavorTitle: 'More Info',
    flavorDescription: 'Unwind with a complimentary couples\' massage, followed by a sunset cocktail party.',
    flavorList: [
      'Exclusive access to the beachside yoga pavilion for private sessions',
      'Personalized concierge service to plan your perfect getaway',
      'Special discounts on spa treatments and water sports'
    ]
  },
  {
    name: 'Sun Package',
    description: 'Ultimate relaxation',
    price: '$800 per person',
    buttonLabel: 'Add to cart',
    flavorTitle: 'More Info',
    flavorDescription: 'Indulge in a rejuvenating breakfast buffet, featuring fresh fruit and artisanal pastries.',
    flavorList: [
      'Private access to the resort\'s infinity pool for ultimate relaxation',
      'Complimentary daily yoga sessions on the beach',
      'Special discounts on gourmet dining experiences'
    ]
  },
  {
    name: 'Fun Package',
    description: 'Adventure awaits',
    price: '$700 per person',
    buttonLabel: 'Add to cart',
    flavorTitle: 'More Info',
    flavorDescription: 'Get your adrenaline pumping with a complimentary water sports session.',
    flavorList: [
      'Priority access to the resort\'s adventure center for snorkeling and kayaking',
      'Exclusive discounts on local excursions and activities',
      'Special perks at the resort\'s beachside bar and grill'
    ]
  }
];

// Get all the "More Info" buttons
const moreInfoButtons = document.querySelectorAll('.btn-info');

// Add a click event listener to each button
moreInfoButtons.forEach(button => {
  button.addEventListener('click', () => {
    const flavorSection = button.nextElementSibling;
    
    

    if (flavorSection.classList.contains('collapse')) {
      flavorSection.classList.remove('collapse');
      flavorSection.classList.add('show');

      button.textContent = 'Show Less';
  } else {
      flavorSection.classList.remove('show');
      flavorSection.classList.add('collapse');

      button.textContent = 'More Info';
  }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('nav ul');

  // Function to close menu
  const closeMenu = () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
  };

  // Function to toggle menu
  const toggleMenu = () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
  };

  // Hamburger click event
  hamburger.addEventListener('click', toggleMenu);

  // Close menu when clicking a nav link
  document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
          closeMenu();
      }
  });
});


class ShoppingCart {
  constructor() {
      this.items = [];
      this.cart = document.querySelector('.floating-cart');
      this.cartItems = this.cart.querySelector('.cart-items');
      this.cartCount = this.cart.querySelector('.cart-count');
      this.totalAmount = this.cart.querySelector('.total-amount');
      this.checkoutBtn = this.cart.querySelector('.checkout-btn');
      
      this.initialize();
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
document.addEventListener('DOMContentLoaded', () => {
  const cart = new ShoppingCart();
});