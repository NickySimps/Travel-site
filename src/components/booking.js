export const initializeBooking = () => {
    const calendarModal = document.getElementById('calendarModal');
    const checkAvailabilityButtons = document.querySelectorAll('.booking-btn');
    const closeBtn = document.querySelector('.close-calendar');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const monthDisplay = document.getElementById('currentMonth');
    const calendarGrid = document.getElementById('calendarGrid');
    const checkInDisplay = document.getElementById('checkInDisplay');
    const checkOutDisplay = document.getElementById('checkOutDisplay');
    const confirmButton = document.getElementById('confirmDates');

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let checkInDate = null;
    let checkOutDate = null;
    let currentPackage = null;

    

    const bookedDates = {
     
        'villa-alhambra': [
            { start: new Date(2024, 2, 20), end: new Date(2024, 2, 23) },
            { start: new Date(2024, 3, 3), end: new Date(2024, 3, 6) }
        ],
        'pool-villa': [
            { start: new Date(2024, 2, 25), end: new Date(2024, 2, 28) },
            { start: new Date(2024, 3, 10), end: new Date(2024, 3, 13) }
        ],
        'guest-villa': [
            { start: new Date(2024, 3, 15), end: new Date(2024, 3, 18) }
        ],
        'tower-villa': [
            { start: new Date(2024, 3, 5), end: new Date(2024, 3, 8) }
        ],
        'garden-villa': [
            { start: new Date(2024, 3, 20), end: new Date(2024, 3, 23) }
        ]
    };

    const packageTotalPrices = {
        'villa-alhambra': {
            basePrice: 12438,  // 4146 x 3 nights
            withCatering: 15438,  // base + 3000 (catering)
            withTransport: 12988,  // base + 550 (transport)
            withBoth: 15988  // base + 3000 + 550
        },
        'pool-villa': {
            basePrice: 10500,
            withCatering: 13500,  // base + 3000
            withTransport: 11050,  // base + 550
            withBoth: 14050   // base + 3000 + 550
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

    const isDateBooked = (startDate) => {
        if (!currentPackage || !bookedDates[currentPackage]) return false;
    
        // Check each day of the 3-night stay
        for (let i = 0; i < 3; i++) {
            const checkDate = new Date(startDate);
            checkDate.setDate(checkDate.getDate() + i);
            
            const isBooked = bookedDates[currentPackage].some(booking => {
                const bookingStart = new Date(booking.start);
                const bookingEnd = new Date(booking.end);
                bookingStart.setHours(0, 0, 0, 0);
                bookingEnd.setHours(0, 0, 0, 0);
                checkDate.setHours(0, 0, 0, 0);
                return checkDate >= bookingStart && checkDate <= bookingEnd;
            });
    
            if (isBooked) return true;
        }
        return false;
    };

    const isInRange = (date) => {
        if (!checkInDate || !checkOutDate) return false;
        return date > checkInDate && date < checkOutDate;
    };

    const updateTotal = () => {
        if (!currentPackage) return;
    
        const hasCatering = document.getElementById('cateringService').checked;
        const hasTransport = document.getElementById('transportService').checked;
        
        let finalPrice;
        if (hasCatering && hasTransport) {
            finalPrice = packageTotalPrices[currentPackage].withBoth;
        } else if (hasCatering) {
            finalPrice = packageTotalPrices[currentPackage].withCatering;
        } else if (hasTransport) {
            finalPrice = packageTotalPrices[currentPackage].withTransport;
        } else {
            finalPrice = packageTotalPrices[currentPackage].basePrice;
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
    
        // Always set checkInDate to clicked date
        checkInDate = clickedDate;
        
        // Calculate checkout date (3 nights later)
        checkOutDate = new Date(clickedDate);
        checkOutDate.setDate(checkOutDate.getDate() + 3);
        
        // Validate if checkout date is available
        if (isDateBooked(checkOutDate)) {
            alert('The selected dates are not available. Some days in this range are already booked.');
            checkInDate = null;
            checkOutDate = null;
        }
    
        updateDateDisplay();
        createCalendar();
    };

    const createCalendar = () => {
        monthDisplay.textContent = `${months[currentMonth]} ${currentYear}`;
        calendarGrid.innerHTML = '';

        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day calendar-weekday';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }

        for (let day = 1; day <= lastDate; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
    
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
    
            const date = new Date(currentYear, currentMonth, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
    
            if (date < today) {
                dayElement.classList.add('past');
            } else if (isDateBooked(date)) {
                dayElement.classList.add('booked');
            } else {
                dayElement.onclick = () => handleDateClick(day);
                
                // Add hover effect to show potential 3-night range
                dayElement.addEventListener('mouseenter', () => {
                    const hoverDate = new Date(currentYear, currentMonth, day);
                    const potentialCheckout = new Date(hoverDate);
                    potentialCheckout.setDate(potentialCheckout.getDate() + 3);
                    
                    // Only show hover effect if the full 3-night range is available
                    if (!isDateBooked(hoverDate)) {
                        dayNumber.classList.add('hover');
                        // Highlight the potential range
                        for (let i = 1; i <= 2; i++) {
                            const rangeDate = new Date(hoverDate);
                            rangeDate.setDate(rangeDate.getDate() + i);
                            const rangeDayEl = document.querySelector(
                                `.calendar-day[data-date="${rangeDate.toISOString().split('T')[0]}"]`
                            );
                            if (rangeDayEl) rangeDayEl.classList.add('in-range-hover');
                        }
                    }
                });
                
                dayElement.addEventListener('mouseleave', () => {
                    document.querySelectorAll('.hover, .in-range-hover')
                        .forEach(el => {
                            el.classList.remove('hover', 'in-range-hover');
                        });
                });
            }
    
            // Add data attribute for date targeting
            dayElement.setAttribute('data-date', date.toISOString().split('T')[0]);
    
            // Update selected date display
            if (checkInDate && date.getTime() === checkInDate.getTime()) {
                dayNumber.classList.add('selected-checkin');
            } else if (checkInDate && date > checkInDate && date <= checkOutDate) {
                dayNumber.classList.add('in-range');
            }
    
            dayElement.appendChild(dayNumber);
            calendarGrid.appendChild(dayElement);
        }
    };

    // Event Listeners
    checkAvailabilityButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentPackage = button.dataset.package;
            checkInDate = null;
            checkOutDate = null;

            document.getElementById('guestCount').max = maxGuests[currentPackage];
            document.getElementById('guestCount').value = 1;
            document.getElementById('roomCount').value = 1;
            document.getElementById('cateringService').checked = false;
            document.getElementById('transportService').checked = false;
            document.getElementById('totalAmount').textContent = '$0';

            updateDateDisplay();
            calendarModal.classList.add('active');
            createCalendar();
        });
    });

    closeBtn?.addEventListener('click', () => {
        calendarModal.classList.remove('active');
    });

    prevMonthBtn?.addEventListener('click', () => {
        if (currentMonth === 0) {
            currentYear--;
            currentMonth = 11;
        } else {
            currentMonth--;
        }
        createCalendar();
    });

    nextMonthBtn?.addEventListener('click', () => {
        if (currentMonth === 11) {
            currentYear++;
            currentMonth = 0;
        } else {
            currentMonth++;
        }
        createCalendar();
    });

    document.querySelectorAll('.number-input .decrease').forEach(button => {
        button.addEventListener('click', function () {
            const input = this.parentElement.querySelector('input');
            if (parseInt(input.value) > parseInt(input.min)) {
                input.value = parseInt(input.value) - 1;
                updateTotal();
            }
        });
    });

    document.querySelectorAll('.number-input .increase').forEach(button => {
        button.addEventListener('click', function () {
            const input = this.parentElement.querySelector('input');
            if (parseInt(input.value) < parseInt(input.max)) {
                input.value = parseInt(input.value) + 1;
                updateTotal();
            }
        });
    });

    document.getElementById('cateringService')?.addEventListener('change', updateTotal);
    document.getElementById('transportService')?.addEventListener('change', updateTotal);

    document.querySelectorAll('.number-input input').forEach(input => {
        input.addEventListener('change', () => {
            if (parseInt(input.value) < parseInt(input.min)) {
                input.value = input.min;
            }
            if (parseInt(input.value) > parseInt(input.max)) {
                input.value = input.max;
            }
            updateTotal();
        });
    });

    function validateVillaBooking(villaId) {
        const maxGuests = {
            'villa-alhambra': 6,
            'pool-villa': 4,
            'guest-villa': 4,
            'tower-villa': 4,
            'garden-villa': 2
        };

        const guestCount = parseInt(document.getElementById('guestCount').value);
        if (guestCount > maxGuests[villaId]) {
            alert(`This villa has a maximum capacity of ${maxGuests[villaId]} guests.`);
            return false;
        }
        return true;
    }
    function initializeTooltips() {
        const bookedDays = document.querySelectorAll('.calendar-day.booked');
        bookedDays.forEach(day => {
            day.title = "This date is not available";
        });
    }



    confirmButton?.addEventListener('click', () => {
        if (checkInDate && checkOutDate && validateVillaBooking(currentPackage)) {
            const hasCatering = document.getElementById('cateringService').checked;
            const hasTransport = document.getElementById('transportService').checked;
            
            let finalPrice;
            if (hasCatering && hasTransport) {
                finalPrice = packageTotalPrices[currentPackage].withBoth;
            } else if (hasCatering) {
                finalPrice = packageTotalPrices[currentPackage].withCatering;
            } else if (hasTransport) {
                finalPrice = packageTotalPrices[currentPackage].withTransport;
            } else {
                finalPrice = packageTotalPrices[currentPackage].basePrice;
            }
    
            // Update Snipcart button
            const snipcartButton = document.querySelector(`[data-item-id="${currentPackage}"]`);
            if (snipcartButton) {
                snipcartButton.setAttribute('data-item-price', finalPrice.toString());
                snipcartButton.setAttribute('data-item-custom1-value', formatDate(checkInDate));
                snipcartButton.setAttribute('data-item-custom2-value', formatDate(checkOutDate));
                snipcartButton.setAttribute('data-item-custom3-value', document.getElementById('guestCount').value);
                snipcartButton.setAttribute('data-item-custom4-value', document.getElementById('roomCount').value);
                snipcartButton.setAttribute('data-item-custom5-value', 
                    hasCatering && hasTransport ? 'Both' :
                    hasCatering ? 'Daily Catering' :
                    hasTransport ? 'Airport Transport & Insurance' : 'None'
                );
            }
    
            calendarModal.classList.remove('active');
        }
    });
    
    calendarModal?.addEventListener('click', (e) => {
        if (e.target === calendarModal) {
            calendarModal.classList.remove('active');
        }
    });
};

