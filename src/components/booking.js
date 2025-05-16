// Fixed booking.js with proper date highlighting

export const initializeBooking = () => {
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

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let checkInDate = null;
    let checkOutDate = null;
    let currentPackage = null;
    let currentBookingDetails = null;

    // Map for property base names matching the actual file names with spaces
    const propertyImageMap = {
        'villa-alhambra': 'Villa Alhambra',
        'pool-villa': 'Pool Villa',
        'guest-villa': 'Guest Villa',
        'tower-villa': 'Tower Villa',
        'garden-villa': 'Garden Villa'
    };

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

    const packagePrices = {
        'villa-alhambra': {
            basePrice: 2500,
            perNight: true,
            withCatering: 3000,
            withTransport: 550,
            withBoth: 3550
        },
        'pool-villa': {
            basePrice: 1800,
            perNight: true,
            withCatering: 3000,
            withTransport: 550,
            withBoth: 3550
        },
        'guest-villa': {
            basePrice: 1500,
            perNight: true,
            withCatering: 3000,
            withTransport: 550,
            withBoth: 3550
        },
        'tower-villa': {
            basePrice: 3300,
            perNight: true,
            withCatering: 3000,
            withTransport: 550,
            withBoth: 3550
        },
        'garden-villa': {
            basePrice: 2800,
            perNight: true,
            withCatering: 3000,
            withTransport: 550,
            withBoth: 3550
        }
    };

    const maxGuests = {
        'villa-alhambra': 6,
        'pool-villa': 4,
        'guest-villa': 4,
        'tower-villa': 4,
        'garden-villa': 2
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const formatDate = (date) => {
        return date ? date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }) : 'Not selected';
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

    const getBasePropertyName = (packageId) => {
        // Return the exact file name for image paths
        return propertyImageMap[packageId] || packageId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const updateTotal = () => {
        if (!currentPackage || !checkInDate || !checkOutDate) return 0;

        const hasCatering = document.getElementById('cateringService')?.checked || false;
        const hasTransport = document.getElementById('transportService')?.checked || false;

        let price = packagePrices[currentPackage];
        let baseTotal = price.basePrice;

        // Calculate total nights
        const nights = calculateNights(checkInDate, checkOutDate);

        // If price is per night, multiply by number of nights
        if (price.perNight) {
            baseTotal = baseTotal * nights;
        }

        // Add services costs
        let serviceCost = 0;
        if (hasCatering && hasTransport) {
            serviceCost = price.withBoth;
        } else if (hasCatering) {
            serviceCost = price.withCatering;
        } else if (hasTransport) {
            serviceCost = price.withTransport;
        }

        const finalPrice = baseTotal + serviceCost;

        // Update the displayed total
        const totalElement = document.getElementById('totalAmount');
        if (totalElement) {
            totalElement.textContent = `$${finalPrice.toLocaleString()}`;
        }

        return finalPrice;
    };

    const updateDateDisplay = () => {
        if (checkInDisplay && checkOutDisplay) {
            checkInDisplay.textContent = `Check-in: ${formatDate(checkInDate)}`;
            checkOutDisplay.textContent = `Check-out: ${formatDate(checkOutDate)}`;
        }
        
        if (confirmButton) {
            confirmButton.disabled = !(checkInDate && checkOutDate);
        }
        
        updateTotal();
    };

    const handleDateClick = (date) => {
        const clickedDate = new Date(currentYear, currentMonth, date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (clickedDate < today || isDateBooked(clickedDate)) return;

        // FIX: Set check-in date first
        checkInDate = clickedDate;
        
        // Set check-out date to 3 days later
        checkOutDate = new Date(clickedDate);
        checkOutDate.setDate(checkOutDate.getDate() + 3);

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
                    if (!checkInDate) {
                        dayNumber.classList.add('hover');
                    }
                });

                dayElement.addEventListener('mouseleave', () => {
                    if (!checkInDate) {
                        dayNumber.classList.remove('hover');
                    }
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
                currentPackage = button.dataset.package;
                checkInDate = null;
                checkOutDate = null;

                // Reset form values
                if (document.getElementById('guestCount')) {
                    document.getElementById('guestCount').max = maxGuests[currentPackage] || 6;
                    document.getElementById('guestCount').value = 1;
                }

                if (document.getElementById('roomCount')) {
                    document.getElementById('roomCount').value = 1;
                }

                if (document.getElementById('cateringService')) {
                    document.getElementById('cateringService').checked = false;
                }

                if (document.getElementById('transportService')) {
                    document.getElementById('transportService').checked = false;
                }

                updateDateDisplay();
                
                if (calendarModal) {
                    calendarModal.classList.add('active');
                }
                
                createCalendar();
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
    const cateringCheckbox = document.getElementById('cateringService');
    const transportCheckbox = document.getElementById('transportService');
    
    if (cateringCheckbox) {
        cateringCheckbox.addEventListener('change', updateTotal);
    }
    
    if (transportCheckbox) {
        transportCheckbox.addEventListener('change', updateTotal);
    }

    // Confirm booking
    if (confirmButton) {
        confirmButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!checkInDate || !checkOutDate) return;

            // Calculate booking total
            const totalPrice = updateTotal();

            // Get services
            const services = [];
            if (document.getElementById('cateringService')?.checked) {
                services.push('Catering');
            }
            if (document.getElementById('transportService')?.checked) {
                services.push('Transport');
            }

            // Format property name
            const propertyName = currentPackage ? 
                currentPackage.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';

            if (calendarModal) {
                calendarModal.classList.remove('active');
            }

            // Add to cart if cart exists
            if (window.usviCart) {
                const nights = calculateNights(checkInDate, checkOutDate);
                const imageName = getBasePropertyName(currentPackage);
                const imagePath = `./public/Pictures/villas/${imageName}.jpg`;
                
                // Create a formatted name for display
                const formattedName = `${propertyName} (${nights} nights${services.length ? ', with ' + services.join(' & ') : ''})`;
                
                // Add to cart with the correct image path
                window.usviCart.addToCart(formattedName, totalPrice, imagePath);
                
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