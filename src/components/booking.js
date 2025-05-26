export const initializeBooking = () => {
    // Modal and general UI elements
    const calendarModal = document.getElementById('calendarModal');
    const inquiryModal = document.getElementById('bookingInquiryModal');
    const checkAvailabilityButtons = document.querySelectorAll('.booking-btn');
    const closeBtn = document.querySelector('.close-calendar');
    const closeInquiryBtn = document.querySelector('.close-inquiry');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const monthDisplay = document.getElementById('currentMonth');
    const calendarGrid = document.getElementById('calendarGrid');
    const checkInDisplay = document.getElementById('checkInDisplay');
    const checkOutDisplay = document.getElementById('checkOutDisplay');
    const confirmButton = document.getElementById('confirmDates');
    const inquiryForm = document.getElementById('inquiryForm');
    const calendarTitle = calendarModal ? calendarModal.querySelector('.calendar-title') : null;

    // Modal dynamic sections
    const modalGuestRoomSection = calendarModal ? calendarModal.querySelector('.guests-rooms-section') : null;
    const modalServicesSection = calendarModal ? calendarModal.querySelector('.services-section') : null;
    const guestCountInput = document.getElementById('guestCount');
    const modalGuestContainer = document.getElementById('modalGuestContainer');
    const modalGuestLabel = document.getElementById('modalGuestLabel');
    const roomCountInput = document.getElementById('roomCount');
    const modalRoomContainer = document.getElementById('modalRoomContainer');
    const numberInputControls = calendarModal.querySelectorAll('.number-input button');
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let checkInDate = null;
    let checkOutDate = null;
    let currentPackage = null;
    let currentPackageDetails = null; // Will hold details for the currently selected package

    const cateringServiceCheckbox = document.getElementById('cateringService');
    const transportServiceCheckbox = document.getElementById('transportService');

    const bookedDates = {
        'villa-alhambra': [
            { start: new Date(2024, 2, 20), end: new Date(2024, 2, 23) },
            { start: new Date(2024, 3, 3), end: new Date(2024, 3, 6) }
        ],
        'pool-villa': [
            { start: new Date(2024, 2, 25), end: new Date(2024, 2, 28) }
        ]
        // Add more booked dates as needed
    };

    // Centralized package details
    const packageDetailsStore = {
        // Villas
        'villa-alhambra': {
            type: 'villa',
            name: 'Villa Alhambra',
            basePrice: 2500,
            perNight: true,
            services: { catering: 750, transport: 550, both: 1300 }, // Daily/flat rates for modal services
            maxGuests: 6,
            imageName: 'Villa Alhambra', // Filename without extension for villas, assuming .jpg
            description: "Main villa with great room and luxury suites"
        },
        'pool-villa': {
            type: 'villa',
            name: 'Pool Villa',
            basePrice: 1800,
            perNight: true,
            services: { catering: 750, transport: 550, both: 1300 },
            maxGuests: 4,
            imageName: 'Pool Villa',
            description: "Pool-side villa with direct deck access"
        },
        'guest-villa': {
            type: 'villa',
            name: 'Guest Villa',
            basePrice: 1500,
            perNight: true,
            services: { catering: 750, transport: 550, both: 1300 },
            maxGuests: 4,
            imageName: 'Guest Villa',
            description: "Adjacent to second pool with outdoor bar"
        },
        'tower-villa': {
            type: 'villa',
            name: 'Tower Villa',
            basePrice: 3300,
            perNight: true,
            services: { catering: 750, transport: 550, both: 1300 },
            maxGuests: 4,
            imageName: 'Tower Villa',
            description: "Featuring 360° rooftop views"
        },
        'garden-villa': {
            type: 'villa',
            name: 'Garden Villa',
            basePrice: 2800,
            perNight: true,
            services: { catering: 750, transport: 550, both: 1300 },
            maxGuests: 2,
            imageName: 'Garden Villa',
            description: "Private cottage with garden views"
        },
        // Yachts
        'luxury-yacht': {
            type: 'yacht',
            name: 'Luxury Yacht',
            basePrice: 2500,
            perNight: true, // true means per day for yachts/services
            maxGuests: 8, // Represents passengers
            imageName: 'yacht1.webp', // Filename with extension
            description: "Ultimate luxury sailing experience"
        },
        'catamaran': {
            type: 'yacht',
            name: 'Catamaran',
            basePrice: 1800,
            perNight: true,
            maxGuests: 10,
            imageName: 'yacht2.webp',
            description: "Stable and spacious sailing"
        },
        'speedboat': {
            type: 'yacht',
            name: 'Speedboat',
            basePrice: 1200,
            perNight: true,
            maxGuests: 6,
            imageName: 'yacht3.webp',
            description: "Fast and thrilling experience"
        },
        // Services
        'catering-service': {
            type: 'service',
            name: 'Private Chef & Catering',
            basePrice: 750, // Daily rate
            perNight: true, // Per day
            imageName: 'catering.jpg', // Filename with extension
            description: "Personalized dining experience in your villa"
        },
        'transport-insurance': {
            type: 'service',
            name: 'Airport Transfer & Insurance',
            basePrice: 550, // Flat rate
            perNight: false,
            imageName: 'transport.jpg',
            description: "Seamless travel experience with complete coverage"
        },
        'concierge-service': { // Added based on accommodations.html
            type: 'service',
            name: 'Premium Concierge Service',
            basePrice: 200, // Daily rate
            perNight: true,
            imageName: 'concierge.jpg',
            description: "Your personal assistant in paradise"
        },
        'complete-package': { // Added based on accommodations.html
            type: 'service',
            name: 'Complete Service Package',
            basePrice: 1000, // Assuming flat rate, adjust if per day
            perNight: false,
            imageName: 'premium.jpg',
            description: "All-inclusive luxury experience"
        }
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const formatDate = (date) => {
        if (!date) return 'Not selected';
        // Ensure date is a Date object
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return 'Invalid date';

        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    };

    const calculateNights = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 0;
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((checkOut - checkIn) / oneDay));
    };

    const isDateBooked = (date) => {
        if (!currentPackage || !bookedDates[currentPackage]) return false;

        return bookedDates[currentPackage].some(booking => {
            const bookingStart = new Date(booking.start);
            const bookingEnd = new Date(booking.end);
            return date >= bookingStart && date <= bookingEnd;
        });
    };

    const getImagePath = (pkgId) => {
        const details = packageDetailsStore[pkgId];
        if (!details || !details.imageName) return './public/Pictures/default.jpg'; // Fallback

        switch (details.type) {
            case 'villa':
                return `./public/Pictures/villas/${details.imageName}.jpg`;
            case 'yacht':
                return `./public/Pictures/yachts/${details.imageName}`;
            case 'service':
                return `./public/Pictures/accommodations/${details.imageName}`;
            default:
                return './public/Pictures/default.jpg';
        }
    };

    const updateTotal = () => {
        if (!currentPackageDetails || !checkInDate) { // Only checkInDate needed for flat rates
            if (document.getElementById('totalAmount')) document.getElementById('totalAmount').textContent = '$0';
            return 0;
        }

        let total = 0;
        const nights = (checkOutDate && checkInDate) ? calculateNights(checkInDate, checkOutDate) : 1; // Default to 1 night/day if no checkout

        if (currentPackageDetails.perNight) {
            total = currentPackageDetails.basePrice * (nights > 0 ? nights : 1);
        } else {
            total = currentPackageDetails.basePrice; // Flat rate
        }

        // Add costs for modal-selected services (only for villas)
        let serviceCost = 0;
        if (currentPackageDetails.type === 'villa' && currentPackageDetails.services) {
            const hasCatering = cateringServiceCheckbox?.checked || false;
            const hasTransport = transportServiceCheckbox?.checked || false;

            if (hasCatering && hasTransport) {
                // If 'both' is a combined rate for the duration, use it. Otherwise, sum daily rates.
                // Assuming services.both is a combined flat addon, or services.catering/transport are daily
                serviceCost += (currentPackageDetails.services.both || (currentPackageDetails.services.catering + currentPackageDetails.services.transport)) * (currentPackageDetails.services.catering ? nights : 1);
            } else if (hasCatering) {
                serviceCost += currentPackageDetails.services.catering * nights;
            } else if (hasTransport) {
                // Transport might be flat or per-stay, adjust if it's daily
                serviceCost += currentPackageDetails.services.transport; // Assuming flat for transport if selected alone
            }
        }
        total += serviceCost;

        // Update the displayed total
        const totalElement = document.getElementById('totalAmount');
        if (totalElement) {
            totalElement.textContent = `$${total.toLocaleString()}`;
        }
        return total;
    };

    const updateDateDisplay = () => {
        if (checkInDisplay && checkOutDisplay) {
            checkInDisplay.textContent = `Check-in: ${formatDate(checkInDate)}`;
            checkOutDisplay.textContent = `Check-out: ${formatDate(checkOutDate)}`;
            if (currentPackageDetails && (currentPackageDetails.type === 'service' && !currentPackageDetails.perNight)) {
                 checkInDisplay.textContent = `Service Date: ${formatDate(checkInDate)}`;
                 checkOutDisplay.textContent = `Ends: ${formatDate(checkInDate)}`; // For flat rate services, start and end are same
            } else if (currentPackageDetails && (currentPackageDetails.type === 'yacht' || currentPackageDetails.type === 'service')) {
                checkInDisplay.textContent = `Start Date: ${formatDate(checkInDate)}`;
                checkOutDisplay.textContent = `End Date: ${formatDate(checkOutDate)}`;
            }
        }
        
        if (confirmButton) {
            // For flat rate services, only checkInDate is needed. For others, both.
            const needsCheckout = !(currentPackageDetails && currentPackageDetails.type === 'service' && !currentPackageDetails.perNight);
            confirmButton.disabled = !(checkInDate && (needsCheckout ? checkOutDate : true));
        }
        updateTotal();
    };

    const handleDateClick = (date) => {
        const clickedDate = new Date(currentYear, currentMonth, date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (clickedDate < today || isDateBooked(clickedDate)) return;

        // For flat-rate services, only one date selection is needed.
        if (currentPackageDetails && currentPackageDetails.type === 'service' && !currentPackageDetails.perNight) {
            checkInDate = clickedDate;
            checkOutDate = clickedDate; // Set checkout same as checkin for single day/flat rate
            console.log('Service date selected:', formatDate(checkInDate));
        } else if (!checkInDate || (checkInDate && checkOutDate)) {
            // First click (select check-in) or restarting selection
            checkInDate = clickedDate;
            checkOutDate = null;
            console.log('Check-in selected:', formatDate(checkInDate));
        } else if (checkInDate && !checkOutDate) {
            // Second click (select check-out)
            if (clickedDate > checkInDate) {

                // Check for booked dates within the selected range
                let tempDate = new Date(checkInDate);
                tempDate.setDate(tempDate.getDate() + 1); // Start checking from day after check-in
                let rangeIsClear = true;
                while (tempDate < clickedDate) {
                    if (isDateBooked(tempDate)) {
                        rangeIsClear = false;
                        break;
                    }
                    tempDate.setDate(tempDate.getDate() + 1);
                }

                if (rangeIsClear) {
                    checkOutDate = clickedDate;
                    console.log('Check-out selected:', formatDate(checkOutDate));
                } else {
                    alert('The selected date range includes booked dates. Please choose a different check-out date.');
                }
            } else {
                // Clicked date is before or same as current check-in, so treat as new check-in
                checkInDate = clickedDate;
                checkOutDate = null;
            }
        }

        updateDateDisplay();
        createCalendar(); // Refresh the calendar to show the selection
    };

    const createCalendar = () => {
        if (!monthDisplay || !calendarGrid) return;
        
        monthDisplay.textContent = `${months[currentMonth]} ${currentYear}`;
        calendarGrid.innerHTML = '';

        // Add weekday headers
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day header';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Add empty cells for days before first of month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }

        // Create calendar days
        for (let day = 1; day <= lastDate; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';

            const date = new Date(currentYear, currentMonth, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;

            // Apply appropriate classes based on date status
            if (date < today) {
                dayElement.classList.add('past');
            } else if (isDateBooked(date)) {
                dayElement.classList.add('booked');
            } else {
                dayElement.onclick = () => handleDateClick(day);

                // Add hover effects for available dates
                dayElement.addEventListener('mouseenter', () => {
                    if (!dayElement.classList.contains('past') && !dayElement.classList.contains('booked')) {
                        dayNumber.classList.add('hover');
                    }
                });

                dayElement.addEventListener('mouseleave', () => {
                    // No need to check checkInDate, just remove hover if it was added
                    dayNumber.classList.remove('hover');
                });
            }

            // Check if this date is the check-in date
            if (checkInDate && date.getTime() === checkInDate.getTime()) {
                dayNumber.classList.add('selected-checkin');
            } 
            // Check if this date is the check-out date
            else if (checkOutDate && date.getTime() === checkOutDate.getTime()) {
                dayNumber.classList.add('selected-checkout');
            } 
            // Check if this date is in the range between check-in and check-out
            else if (checkInDate && checkOutDate && 
                     date > checkInDate && date < checkOutDate) {
                dayNumber.classList.add('in-range');
            }

            dayElement.appendChild(dayNumber);
            calendarGrid.appendChild(dayElement);
        }
    };

    // Event Listeners
    if (checkAvailabilityButtons) {
        checkAvailabilityButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentPackage = button.dataset.package;
                currentPackageDetails = packageDetailsStore[currentPackage];

                if (!currentPackageDetails) {
                    console.error("Package details not found for:", currentPackage);
                    return;
                }

                checkInDate = null;
                checkOutDate = null;

                // Update modal title
                if (calendarTitle) {
                    calendarTitle.textContent = `Book Your ${currentPackageDetails.type === 'villa' ? 'Stay' : currentPackageDetails.name}`;
                }

                // Configure modal sections based on package type
                if (modalGuestRoomSection) modalGuestRoomSection.style.display = 'none';
                if (modalServicesSection) modalServicesSection.style.display = 'none';
                if (modalGuestContainer) modalGuestContainer.style.display = 'none';
                if (modalRoomContainer) modalRoomContainer.style.display = 'none';


                if (currentPackageDetails.type === 'villa') {
                    if (modalGuestRoomSection) modalGuestRoomSection.style.display = 'flex'; // Or 'block'
                    if (modalServicesSection) modalServicesSection.style.display = 'block';
                    if (modalGuestContainer && modalGuestLabel) {
                        modalGuestContainer.style.display = 'block';
                        modalGuestLabel.textContent = 'Guests';
                    }
                    if (modalRoomContainer) modalRoomContainer.style.display = 'block';

                    if (guestCountInput) {
                        guestCountInput.max = currentPackageDetails.maxGuests || 6;
                        guestCountInput.value = 1;
                    }
                    if (roomCountInput) roomCountInput.value = 1; // Default for villas
                    if (cateringServiceCheckbox) cateringServiceCheckbox.checked = false;
                    if (transportServiceCheckbox) transportServiceCheckbox.checked = false;

                } else if (currentPackageDetails.type === 'yacht') {
                    if (modalGuestRoomSection) modalGuestRoomSection.style.display = 'flex';
                     if (modalGuestContainer && modalGuestLabel) {
                        modalGuestContainer.style.display = 'block';
                        modalGuestLabel.textContent = 'Passengers';
                    }
                    if (guestCountInput) {
                        guestCountInput.max = currentPackageDetails.maxGuests || 8;
                        guestCountInput.value = 1;
                    }
                } else if (currentPackageDetails.type === 'service') {
                    // For services, guest/room/additional villa services are usually not applicable in this modal
                    // The date selection (single or range) is primary.
                    // If a service has a guest limit (e.g. group catering), it could be enabled here.
                }

                updateDateDisplay();
                
                if (calendarModal) {
                    calendarModal.classList.add('active');
                    calendarModal.setAttribute('data-current-package-type', currentPackageDetails.type);
                }
                
                createCalendar();
            });
        });
    }

    // Guest and Room Counters
    if (numberInputControls) {
        numberInputControls.forEach(button => {
            button.addEventListener('click', () => {
                const inputField = button.parentElement.querySelector('input');
                if (!inputField) return;

                let currentValue = parseInt(inputField.value);
                const min = parseInt(inputField.min);
                const max = parseInt(inputField.max);

                if (button.classList.contains('increase')) {
                    if (currentValue < max) currentValue++;
                } else if (button.classList.contains('decrease')) {
                    if (currentValue > min) currentValue--;
                }
                inputField.value = currentValue;
                updateTotal(); // Recalculate total if guest/room count affects price (or for future-proofing)
            });
        });
    }
    // Modal controls
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (calendarModal) {
                calendarModal.classList.remove('active');
            }
        });
    }
    
    if (closeInquiryBtn) {
        closeInquiryBtn.addEventListener('click', () => {
            if (inquiryModal) {
                inquiryModal.classList.remove('active');
            }
        });
    }

    // Calendar navigation
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
            createCalendar();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
            createCalendar();
        });
    }

    // Service toggles
    if (cateringServiceCheckbox) {
        cateringServiceCheckbox.addEventListener('change', updateTotal);
    }
    
    if (transportServiceCheckbox) {
        transportServiceCheckbox.addEventListener('change', updateTotal);
    }

    // Confirm booking
    if (confirmButton) {
        confirmButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!currentPackageDetails || !checkInDate) return;
            // For items that require a date range, checkOutDate is also needed
            if (currentPackageDetails.perNight && !checkOutDate) return;

            // Calculate booking total
            const totalPrice = updateTotal();
            const nights = (checkInDate && checkOutDate) ? calculateNights(checkInDate, checkOutDate) : 1;

            // Get services
            let itemName = currentPackageDetails.name;
            if (currentPackageDetails.type === 'villa') {
                const selectedServices = [];
                if (cateringServiceCheckbox?.checked) selectedServices.push('Catering');
                if (transportServiceCheckbox?.checked) selectedServices.push('Transport');
                if (selectedServices.length > 0) {
                    itemName += ` (${nights} nights, with ${selectedServices.join(' & ')})`;
                } else {
                    itemName += ` (${nights} nights)`;
                }
            } else if (currentPackageDetails.perNight) { // Yachts or per-day services
                 itemName += ` (${nights} day${nights > 1 ? 's' : ''})`;
            }
            // For flat rate services, itemName is just currentPackageDetails.name

            if (calendarModal) {
                calendarModal.classList.remove('active');
            }

            if (window.shoppingCart) {
                const imagePath = getImagePath(currentPackage);
                const itemDescription = currentPackageDetails.description || itemName;

                // Create a unique ID for the booking item, incorporating dates to allow re-booking same package for different dates
                let itemIdSuffix = checkInDate.toISOString().split('T')[0];
                if (checkOutDate && checkInDate.toISOString() !== checkOutDate.toISOString()) {
                    itemIdSuffix += '_' + checkOutDate.toISOString().split('T')[0];
                }
                const itemId = `${currentPackage}-${itemIdSuffix}`;

                window.shoppingCart.addToCart(itemName, totalPrice, imagePath, itemId, itemDescription);
                
            } else {
                alert("Cart system not initialized. Please refresh the page and try again.");
            }
        });
    }

    // Initialize the calendar if it exists
    if (calendarGrid) {
        createCalendar();
    }
};