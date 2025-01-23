//simport ShoppingCart from './ShoppingCart.js';

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






// After the Snipcart script loading code
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

// document.addEventListener("DOMContentLoaded", ()=>{
//   const cart = new ShoppingCart();
// });


document.addEventListener('DOMContentLoaded', () => {
  const moreInfoButtons = document.querySelectorAll('.btn-info');
  
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
});