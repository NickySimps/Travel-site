// Enhanced booking.js with proper cart integration

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

    const updateTotal = () => {
        if (!currentPackage || !checkInDate || !checkOutDate) return 0;

        const hasCatering = document.getElementById('cateringService').checked;
        const hasTransport = document.getElementById('transportService').checked;
        
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
        checkInDisplay.textContent = `Check-in: ${formatDate(checkInDate)}`;
        checkOutDisplay.textContent = `Check-out: ${formatDate(checkOutDate)}`;
        confirmButton.disabled = !(checkInDate && checkOutDate);
        updateTotal();
    };

    const handleDateClick = (date) => {
        const clickedDate = new Date(currentYear, currentMonth, date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (clickedDate < today || isDateBooked(clickedDate)) return;

        checkInDate = clickedDate;
        checkOutDate = new Date(clickedDate);
        checkOutDate.setDate(checkOutDate.getDate() + 3);
        
        updateDateDisplay();
        createCalendar();
    };

    const createCalendar = () => {
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

            if (date < today) {
                dayElement.classList.add('past');
            } else if (isDateBooked(date)) {
                dayElement.classList.add('booked');
            } else {
                dayElement.onclick = () => handleDateClick(day);
                
                // Add hover effects
                dayElement.addEventListener('mouseenter', () => {
                    if (!checkInDate) {
                        dayNumber.classList.add('hover');
                        
                        // Show potential range
                        const hoverDate = new Date(currentYear, currentMonth, day);
                        const potentialEndDate = new Date(hoverDate);
                        potentialEndDate.setDate(potentialEndDate.getDate() + 2);
                        
                        // Find and highlight potential range days
                        const allDays = document.querySelectorAll('.calendar-day');
                        allDays.forEach(dayEl => {
                            if (dayEl.querySelector('.day-number') && !dayEl.classList.contains('header')) {
                                const dayNum = parseInt(dayEl.querySelector('.day-number').textContent);
                                if (!isNaN(dayNum)) {
                                    const dayDate = new Date(currentYear, currentMonth, dayNum);
                                    if (dayDate > hoverDate && dayDate <= potentialEndDate) {
                                        dayEl.querySelector('.day-number').classList.add('in-range-hover');
                                    }
                                }
                            }
                        });
                    }
                });

                dayElement.addEventListener('mouseleave', () => {
                    if (!checkInDate) {
                        dayNumber.classList.remove('hover');
                        document.querySelectorAll('.in-range-hover').forEach(el => {
                            el.classList.remove('in-range-hover');
                        });
                    }
                });
            }

            // Add selected and range highlighting
            if (checkInDate && date.getTime() === checkInDate.getTime()) {
                dayNumber.classList.add('selected-checkin');
            } else if (checkOutDate && date.getTime() === checkOutDate.getTime()) {
                dayNumber.classList.add('selected-checkout');
            } else if (checkInDate && checkOutDate && date > checkInDate && date < checkOutDate) {
                dayNumber.classList.add('in-range');
            }

            dayElement.appendChild(dayNumber);
            calendarGrid.appendChild(dayElement);
        }
    };

    // New function to add booking to cart
    const addBookingToCart = (bookingDetails) => {
        // Debug logs
        console.log("Adding to cart:", bookingDetails);
        
        // First try to find the exact button
        let addToCartButton = document.querySelector(`[data-item-id="${bookingDetails.propertyId}"]`);
        
        // If not found, try broader selectors
        if (!addToCartButton) {
            console.log("Button not found with exact ID, trying alternative selectors");
            // Try to find any button containing the property ID
            const buttons = document.querySelectorAll('.snipcart-add-item');
            for (const btn of buttons) {
                if (btn.dataset.itemId && btn.dataset.itemId.includes(bookingDetails.propertyId)) {
                    addToCartButton = btn;
                    break;
                }
            }
        }
        
        // If still not found, create a new button
        if (!addToCartButton) {
            console.log("Creating custom cart button");
            addToCartButton = document.createElement('button');
            addToCartButton.className = 'snipcart-add-item';
            addToCartButton.dataset.itemId = bookingDetails.propertyId;
            addToCartButton.dataset.itemName = bookingDetails.propertyName;
            addToCartButton.dataset.itemUrl = window.location.href;
            addToCartButton.dataset.itemDescription = `${bookingDetails.propertyName} - ${formatDate(bookingDetails.checkIn)} to ${formatDate(bookingDetails.checkOut)}`;
            addToCartButton.style.display = 'none';
            document.body.appendChild(addToCartButton);
        }
        
        try {
            // Format dates for cart
            const checkInFormatted = bookingDetails.checkIn.toISOString().split('T')[0];
            const checkOutFormatted = bookingDetails.checkOut.toISOString().split('T')[0];
            
            console.log("Setting cart attributes:", {
                dates: `${checkInFormatted} to ${checkOutFormatted}`,
                guests: bookingDetails.guests,
                services: bookingDetails.services,
                total: bookingDetails.total
            });
            
            // Update the Snipcart button attributes
            addToCartButton.dataset.itemCustom1Name = "Check-in";
            addToCartButton.dataset.itemCustom1Value = checkInFormatted;
            
            addToCartButton.dataset.itemCustom2Name = "Check-out";
            addToCartButton.dataset.itemCustom2Value = checkOutFormatted;
            
            addToCartButton.dataset.itemCustom3Name = "Guests";
            addToCartButton.dataset.itemCustom3Value = bookingDetails.guests;
            
            // Handle services
            let servicesOption = "None";
            if (bookingDetails.services.includes('Catering') && bookingDetails.services.includes('Transport')) {
                servicesOption = "Both (+$3550)";
            } else if (bookingDetails.services.includes('Catering')) {
                servicesOption = "Catering (+$3000)";
            } else if (bookingDetails.services.includes('Transport')) {
                servicesOption = "Airport Transport & Insurance (+$550)";
            }
            
            addToCartButton.dataset.itemCustom5Name = "Services";
            addToCartButton.dataset.itemCustom5Value = servicesOption;
            
            // Update price based on nights and services
            const nights = calculateNights(bookingDetails.checkIn, bookingDetails.checkOut);
            addToCartButton.dataset.itemPrice = bookingDetails.total.toFixed(2);
            
            console.log("About to click add to cart button");
            
            // Check if using custom cart or Snipcart
            if (window.Snipcart) {
                // If Snipcart is loaded, use their API directly
                console.log("Using Snipcart API");
                Snipcart.api.items.add({
                    id: bookingDetails.propertyId,
                    name: bookingDetails.propertyName,
                    price: bookingDetails.total.toFixed(2),
                    url: window.location.href,
                    description: `${bookingDetails.propertyName} - ${formatDate(bookingDetails.checkIn)} to ${formatDate(bookingDetails.checkOut)}`,
                    customFields: [
                        {
                            name: "Check-in",
                            value: checkInFormatted
                        },
                        {
                            name: "Check-out",
                            value: checkOutFormatted
                        },
                        {
                            name: "Guests",
                            value: bookingDetails.guests
                        },
                        {
                            name: "Services",
                            value: servicesOption
                        }
                    ]
                });
            } else {
                // Trigger click on the add to cart button
                console.log("Clicking cart button");
                addToCartButton.click();
            }
            
            return true;
        } catch (error) {
            console.error('Error adding booking to cart:', error);
            return false;
        }
    };

    const showInquiryModal = (bookingDetails) => {
        if (!document.getElementById('bookingInquiryModal')) {
            // Create modal if it doesn't exist
            const modalHTML = `
                <div id="bookingInquiryModal" class="inquiry-modal">
                    <div class="inquiry-content">
                        <button class="close-inquiry">&times;</button>
                        <h3>Complete Your Booking Request</h3>
                        <div id="bookingSummary" class="booking-summary">
                            <!-- Filled dynamically -->
                        </div>
                        <form id="inquiryForm" class="inquiry-form">
                            <div class="form-group">
                                <input type="text" id="fullName" name="fullName" placeholder="Full Name" required>
                            </div>
                            <div class="form-group">
                                <input type="email" id="email" name="email" placeholder="Email Address" required>
                            </div>
                            <div class="form-group">
                                <input type="tel" id="phone" name="phone" placeholder="Phone Number" required 
                                       pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number">
                            </div>
                            <div class="form-group">
                                <textarea id="specialRequests" name="specialRequests" 
                                          placeholder="Special Requests or Questions"></textarea>
                            </div>
                            <div class="booking-actions">
                                <button type="button" id="addToCartBtn" class="add-to-cart-btn">Add to Cart</button>
                                <button type="submit" class="submit-inquiry">Submit Booking Request</button>
                            </div>
                        </form>
                    </div>
                </div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Initialize new modal's event listeners
            const newModal = document.getElementById('bookingInquiryModal');
            const closeBtn = newModal.querySelector('.close-inquiry');
            const form = newModal.querySelector('#inquiryForm');
            const addToCartBtn = newModal.querySelector('#addToCartBtn');
            
            closeBtn.addEventListener('click', () => newModal.classList.remove('active'));
            
            addToCartBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent any form submission
                console.log("Add to cart button clicked in modal");
                
                // First close the modal to prevent it from interfering
                newModal.classList.remove('active');
                
                // Short delay to ensure modal is closed before cart action
                setTimeout(() => {
                    if (addBookingToCart(currentBookingDetails)) {
                        alert('Booking added to cart successfully!');
                    } else {
                        alert('There was an error adding your booking to the cart. Please try again.');
                        // Reopen modal if adding to cart failed
                        newModal.classList.add('active');
                    }
                }, 100);
            });
            
            initializeInquiryForm(form);
        } else {
            // Modal exists, just update content and add event listener
            const addToCartBtn = document.getElementById('addToCartBtn');
            if (addToCartBtn) {
                addToCartBtn.removeEventListener('click', null);
                addToCartBtn.addEventListener('click', () => {
                    if (addBookingToCart(currentBookingDetails)) {
                        alert('Booking added to cart successfully!');
                        document.getElementById('bookingInquiryModal').classList.remove('active');
                    } else {
                        alert('There was an error adding your booking to the cart. Please try again.');
                    }
                });
            }
        }

        currentBookingDetails = bookingDetails;
        const summary = document.getElementById('bookingSummary');
        const inquiryModal = document.getElementById('bookingInquiryModal');
        
        if (summary) {
            summary.innerHTML = `
                <p><strong>Property:</strong> ${bookingDetails.propertyName}</p>
                <p><strong>Dates:</strong> ${formatDate(bookingDetails.checkIn)} - ${formatDate(bookingDetails.checkOut)} (${calculateNights(bookingDetails.checkIn, bookingDetails.checkOut)} nights)</p>
                <p><strong>Guests:</strong> ${bookingDetails.guests}</p>
                <p><strong>Services:</strong> ${bookingDetails.services.join(', ') || 'None'}</p>
                <p><strong>Total:</strong> $${bookingDetails.total.toLocaleString()}</p>
            `;
        }

        calendarModal.classList.remove('active');
        inquiryModal.classList.add('active');
    };

    const initializeInquiryForm = (form) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const inquiryData = {
                ...currentBookingDetails,
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                specialRequests: formData.get('specialRequests')
            };

            try {
                // Initialize EmailJS with your public key
                if (typeof emailjs !== 'undefined') {
                    emailjs.init("YOUR_PUBLIC_KEY");

                    // Send the email
                    await emailjs.send(
                        "YOUR_SERVICE_ID",
                        "YOUR_TEMPLATE_ID",
                        {
                            to_email: "bookings@usviretreats.com",
                            from_name: inquiryData.fullName,
                            from_email: inquiryData.email,
                            phone: inquiryData.phone,
                            property: inquiryData.propertyName,
                            check_in: formatDate(inquiryData.checkIn),
                            check_out: formatDate(inquiryData.checkOut),
                            guests: inquiryData.guests,
                            services: inquiryData.services.join(', ') || 'None',
                            total: `${inquiryData.total.toLocaleString()}`,
                            special_requests: inquiryData.specialRequests || 'None'
                        }
                    );
                }

                // Also add to cart
                addBookingToCart(currentBookingDetails);

                // Update modal content to show confirmation
                const modalContent = document.querySelector('.inquiry-content');
                modalContent.innerHTML = `
                    <div class="confirmation-message">
                        <h3>Thank You for Your Booking Request!</h3>
                        <div class="confirmation-details">
                            <p>We have received your request for ${inquiryData.propertyName}.</p>
                            <p>We will contact you shortly at ${inquiryData.email} to finalize your reservation.</p>
                            <p>Your booking has also been added to your cart.</p>
                        </div>
                        <button class="submit-inquiry" onclick="document.getElementById('bookingInquiryModal').classList.remove('active')">
                            Close
                        </button>
                    </div>
                `;

                // Auto-close after delay
                setTimeout(() => {
                    const inquiryModal = document.getElementById('bookingInquiryModal');
                    if (inquiryModal) {
                        inquiryModal.classList.remove('active');
                        // Recreate the original form structure
                        const modalContent = inquiryModal.querySelector('.inquiry-content');
                        if (modalContent) {
                            modalContent.innerHTML = `
                                <button class="close-inquiry">&times;</button>
                                <h3>Complete Your Booking Request</h3>
                                <div id="bookingSummary" class="booking-summary"></div>
                                <form id="inquiryForm" class="inquiry-form">
                                    <div class="form-group">
                                        <input type="text" id="fullName" name="fullName" placeholder="Full Name" required>
                                    </div>
                                    <div class="form-group">
                                        <input type="email" id="email" name="email" placeholder="Email Address" required>
                                    </div>
                                    <div class="form-group">
                                        <input type="tel" id="phone" name="phone" placeholder="Phone Number" required 
                                               pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number">
                                    </div>
                                    <div class="form-group">
                                        <textarea id="specialRequests" name="specialRequests" 
                                                  placeholder="Special Requests or Questions"></textarea>
                                    </div>
                                    <div class="booking-actions">
                                        <button type="button" id="addToCartBtn" class="add-to-cart-btn">Add to Cart</button>
                                        <button type="submit" class="submit-inquiry">Submit Booking Request</button>
                                    </div>
                                </form>
                            `;
                            
                            // Reinitialize event listeners
                            const newCloseBtn = modalContent.querySelector('.close-inquiry');
                            const newForm = modalContent.querySelector('#inquiryForm');
                            const newAddToCartBtn = modalContent.querySelector('#addToCartBtn');
                            
                            if (newCloseBtn) {
                                newCloseBtn.addEventListener('click', () => inquiryModal.classList.remove('active'));
                            }
                            if (newForm) {
                                initializeInquiryForm(newForm);
                            }
                            if (newAddToCartBtn) {
                                newAddToCartBtn.addEventListener('click', () => {
                                    if (addBookingToCart(currentBookingDetails)) {
                                        alert('Booking added to cart successfully!');
                                        inquiryModal.classList.remove('active');
                                    } else {
                                        alert('There was an error adding your booking to the cart. Please try again.');
                                    }
                                });
                            }
                        }
                    }
                    currentBookingDetails = null;
                }, 3000);

            } catch (error) {
                console.error('Error submitting booking:', error);
                const modalContent = document.querySelector('.inquiry-content');
                modalContent.innerHTML = `
                    <div class="confirmation-message error">
                        <h3>Booking Request Error</h3>
                        <p>There was an error submitting your booking. Please try again or contact us directly.</p>
                        <button class="submit-inquiry" onclick="location.reload()">
                            Try Again
                        </button>
                    </div>
                `;
            }
        });
    };

    // Event Listeners
    checkAvailabilityButtons.forEach(button => {
        button.addEventListener('click', () => {
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
            calendarModal.classList.add('active');
            createCalendar();
        });
    });

    // Modal controls
    closeBtn?.addEventListener('click', () => calendarModal.classList.remove('active'));
    closeInquiryBtn?.addEventListener('click', () => inquiryModal.classList.remove('active'));

    // Calendar navigation
    prevMonthBtn?.addEventListener('click', () => {
        currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
        createCalendar();
    });

    nextMonthBtn?.addEventListener('click', () => {
        currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
        createCalendar();
    });

    // Service toggles
    document.getElementById('cateringService')?.addEventListener('change', updateTotal);
    document.getElementById('transportService')?.addEventListener('change', updateTotal);

    // Confirm booking
    confirmButton?.addEventListener('click', (e) => {
        // Prevent default form submission behavior which might be causing the refresh
        e.preventDefault();
        
        if (!checkInDate || !checkOutDate) return;

        // Logging to debug
        console.log("Set Booking clicked for package:", currentPackage);

        // Find property element using different selector strategies to ensure we find it
        let propertyElement = null;
        let propertyName = "";
        
        // First try the original approach
        propertyElement = document.querySelector(`[data-package="${currentPackage}"]`)
            ?.closest('.package-box')
            ?.querySelector('h3');
            
        if (propertyElement) {
            propertyName = propertyElement.textContent;
        } else {
            // Try an alternative approach - look for any button with the package attribute
            const button = document.querySelector(`button[data-package="${currentPackage}"]`);
            if (button) {
                // Find the closest parent with a heading
                const parentBox = button.closest('.package-box, .villa-card');
                if (parentBox) {
                    propertyElement = parentBox.querySelector('h3');
                    if (propertyElement) {
                        propertyName = propertyElement.textContent;
                    }
                }
            }
            
            // If still not found, use the package ID as fallback
            if (!propertyName) {
                propertyName = currentPackage.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                console.log("Using fallback property name:", propertyName);
            }
        }

        const bookingDetails = {
            propertyId: currentPackage,
            propertyName: propertyName,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: document.getElementById('guestCount')?.value || 1,
            services: [],
            total: updateTotal()
        };

        if (document.getElementById('cateringService')?.checked) {
            bookingDetails.services.push('Catering');
        }
        if (document.getElementById('transportService')?.checked) {
            bookingDetails.services.push('Transport');
        }

        console.log("Booking details prepared:", bookingDetails);
        
        // Directly try to add to cart if that's what's needed
        // Uncomment the following line if you want to skip the inquiry modal
        // if (addBookingToCart(bookingDetails)) return;
        
        showInquiryModal(bookingDetails);
    });

    // Initialize the calendar if it exists
    if (calendarGrid) {
        createCalendar();
    }
    
    // Create a direct cart addition function for debugging
    // This can be exposed on the window for testing in console
    window.directAddToCart = (packageId) => {
        if (!packageId) {
            alert("Please specify a package ID");
            return;
        }
        
        // Set up basic booking details
        currentPackage = packageId;
        const today = new Date();
        checkInDate = new Date(today);
        checkInDate.setDate(today.getDate() + 7); // A week from today
        
        checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkInDate.getDate() + 3); // 3 night stay
        
        const propertyName = packageId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        
        const bookingDetails = {
            propertyId: packageId,
            propertyName: propertyName,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: 2,
            services: [],
            total: packagePrices[packageId]?.basePrice * 3 || 1500 * 3
        };
        
        console.log("Direct add to cart triggered for:", bookingDetails);
        
        const success = addBookingToCart(bookingDetails);
        if (success) {
            alert(`${propertyName} added to cart for dates ${formatDate(checkInDate)} to ${formatDate(checkOutDate)}`);
        } else {
            alert("Failed to add to cart directly. Check console for details.");
        }
    };
    
    // Optional: Add debugging helper
    const addDebugOverlay = () => {
        // Only add in development
        if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
            return;
        }
        
        const debugDiv = document.createElement('div');
        debugDiv.className = 'debug-info';
        debugDiv.innerHTML = `
            <p>Debug: Click buttons below to test cart</p>
            <button onclick="window.directAddToCart('villa-alhambra')">Add Alhambra</button>
            <button onclick="window.directAddToCart('pool-villa')">Add Pool Villa</button>
            <button onclick="window.directAddToCart('guest-villa')">Add Guest Villa</button>
        `;
        document.body.appendChild(debugDiv);
    };
    
    // Uncomment to enable debug overlay in development
    // addDebugOverlay();
};

