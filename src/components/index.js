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
    
    // Check if the collapse class is present before clicking the button
    if (flavorSection.classList.contains('collapse')) {
      flavorSection.classList.remove('collapse');
    } else {
      flavorSection.classList.add('collapse');
    }
  });
});