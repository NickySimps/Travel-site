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
            basePrice: 12438,
            withCatering: 15438,
            withTransport: 12988,
            withBoth: 15988
        },
        'pool-villa': {
            basePrice: 10500,
            withCatering: 13500,
            withTransport: 11050,
            withBoth: 14050
        },
        'guest-villa': {
            basePrice: 9600,
            withCatering: 12600,
            withTransport: 10150,
            withBoth: 13150
        },
        'tower-villa': {
            basePrice: 9900,
            withCatering: 12900,
            withTransport: 10450,
            withBoth: 13450
        },
        'garden-villa': {
            basePrice: 8400,
            withCatering: 11400,
            withTransport: 8950,
            withBoth: 11950
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

    const isDateBooked = (date) => {
        if (!currentPackage || !bookedDates[currentPackage]) return false;
        
        return bookedDates[currentPackage].some(booking => {
            const bookingStart = new Date(booking.start);
            const bookingEnd = new Date(booking.end);
            return date >= bookingStart && date <= bookingEnd;
        });
    };

    const updateTotal = () => {
        if (!currentPackage) return 0;

        const hasCatering = document.getElementById('cateringService').checked;
        const hasTransport = document.getElementById('transportService').checked;
        
        let price = packagePrices[currentPackage];
        let finalPrice;

        if (hasCatering && hasTransport) {
            finalPrice = price.withBoth;
        } else if (hasCatering) {
            finalPrice = price.withCatering;
        } else if (hasTransport) {
            finalPrice = price.withTransport;
        } else {
            finalPrice = price.basePrice;
        }

        document.getElementById('totalAmount').textContent = `$${finalPrice.toLocaleString()}`;
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
                            const dayDate = new Date(currentYear, currentMonth, parseInt(dayEl.textContent));
                            if (dayDate > hoverDate && dayDate <= potentialEndDate) {
                                dayEl.querySelector('.day-number').classList.add('in-range-hover');
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
                            <button type="submit" class="submit-inquiry">Submit Booking Request</button>
                        </form>
                    </div>
                </div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Initialize new modal's event listeners
            const newModal = document.getElementById('bookingInquiryModal');
            const closeBtn = newModal.querySelector('.close-inquiry');
            const form = newModal.querySelector('#inquiryForm');
            
            closeBtn.addEventListener('click', () => newModal.classList.remove('active'));
            initializeInquiryForm(form);
        }

        currentBookingDetails = bookingDetails;
        const summary = document.getElementById('bookingSummary');
        const inquiryModal = document.getElementById('bookingInquiryModal');
        
        if (summary) {
            summary.innerHTML = `
                <p><strong>Property:</strong> ${bookingDetails.propertyName}</p>
                <p><strong>Dates:</strong> ${formatDate(bookingDetails.checkIn)} - ${formatDate(bookingDetails.checkOut)}</p>
                <p><strong>Guests:</strong> ${bookingDetails.guests}</p>
                <p><strong>Services:</strong> ${bookingDetails.services.join(', ') || 'None'}</p>
                <p><strong>Total:</strong> ${bookingDetails.total.toLocaleString()}</p>
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

                // Update modal content to show confirmation
                const modalContent = document.querySelector('.inquiry-content');
                modalContent.innerHTML = `
                    <div class="confirmation-message">
                        <h3>Thank You for Your Booking Request!</h3>
                        <div class="confirmation-details">
                            <p>We have received your request for ${inquiryData.propertyName}.</p>
                            <p>We will contact you shortly at ${inquiryData.email} to finalize your reservation.</p>
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
                                    <button type="submit" class="submit-inquiry">Submit Booking Request</button>
                                </form>
                            `;
                            
                            // Reinitialize event listeners
                            const newCloseBtn = modalContent.querySelector('.close-inquiry');
                            const newForm = modalContent.querySelector('#inquiryForm');
                            
                            if (newCloseBtn) {
                                newCloseBtn.addEventListener('click', () => inquiryModal.classList.remove('active'));
                            }
                            if (newForm) {
                                initializeInquiryForm(newForm);
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
            document.getElementById('guestCount').max = maxGuests[currentPackage];
            document.getElementById('guestCount').value = 1;
            document.getElementById('roomCount').value = 1;
            document.getElementById('cateringService').checked = false;
            document.getElementById('transportService').checked = false;
            
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
    confirmButton?.addEventListener('click', () => {
        if (!checkInDate || !checkOutDate) return;

        const propertyElement = document.querySelector(`[data-package="${currentPackage}"]`)
            .closest('.package-box')
            .querySelector('h3');

        const bookingDetails = {
            propertyName: propertyElement.textContent,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: document.getElementById('guestCount').value,
            services: [],
            total: updateTotal()
        };

        if (document.getElementById('cateringService').checked) {
            bookingDetails.services.push('Catering');
        }
        if (document.getElementById('transportService').checked) {
            bookingDetails.services.push('Transport');
        }

        showInquiryModal(bookingDetails);
    });

    // Handle inquiry form submission
    inquiryForm?.addEventListener('submit', async (e) => {
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
            // Format email content
            const emailContent = `
                New Booking Request

                Property: ${inquiryData.propertyName}
                Dates: ${formatDate(inquiryData.checkIn)} - ${formatDate(inquiryData.checkOut)}
                Guests: ${inquiryData.guests}
                Services: ${inquiryData.services.join(', ') || 'None'}
                Total: ${inquiryData.total.toLocaleString()}

                Customer Information:
                Name: ${inquiryData.fullName}
                Email: ${inquiryData.email}
                Phone: ${inquiryData.phone}
                Special Requests: ${inquiryData.specialRequests || 'None'}
            `;

            // Send booking confirmation email
            await fetch('/api/send-booking-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: 'bookings@usviretreats.com',
                    subject: `New Booking Request - ${inquiryData.propertyName}`,
                    text: emailContent,
                    replyTo: inquiryData.email
                })
            });

            // Update modal content to show confirmation
            const modalContent = inquiryModal.querySelector('.inquiry-content');
            modalContent.innerHTML = `
                <div class="confirmation-message">
                    <h3>Thank You for Your Booking Request!</h3>
                    <div class="confirmation-details">
                        <p>We have received your request for ${inquiryData.propertyName}.</p>
                        <p>A confirmation email has been sent to ${inquiryData.email}.</p>
                        <p>We will contact you shortly to finalize your reservation.</p>
                    </div>
                    <button class="submit-inquiry" onclick="document.getElementById('bookingInquiryModal').classList.remove('active')">
                        Close
                    </button>
                </div>
            `;

            // Reset form data after 3 seconds
            setTimeout(() => {
                inquiryModal.classList.remove('active');
                e.target.reset();
                currentBookingDetails = null;
                
                // Restore original modal content
                modalContent.innerHTML = document.getElementById('inquiryModalTemplate').innerHTML;
            }, 3000);

        } catch (error) {
            console.error('Error submitting booking:', error);
            const modalContent = inquiryModal.querySelector('.inquiry-content');
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

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === calendarModal) {
            calendarModal.classList.remove('active');
        }
        if (e.target === inquiryModal) {
            inquiryModal.classList.remove('active');
        }
    });

    // Initialize
    createCalendar();
};