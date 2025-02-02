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

    const prices = {
        'friends-package': 500,
        'sun-package': 800,
        'fun-package': 700,
        'catering': 150,
        'transport': 200
    };

    const bookedDates = {
        'friends-package': [
            { start: new Date(2024, 2, 20), end: new Date(2024, 2, 23) },
            { start: new Date(2024, 3, 3), end: new Date(2024, 3, 6) }
        ],
        'sun-package': [
            { start: new Date(2024, 2, 25), end: new Date(2024, 2, 28) },
            { start: new Date(2024, 3, 10), end: new Date(2024, 3, 13) }
        ],
        'fun-package': [
            { start: new Date(2024, 3, 15), end: new Date(2024, 3, 18) },
            { start: new Date(2024, 3, 22), end: new Date(2024, 3, 25) }
        ]
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
        const startDate = new Date(booking.start);
        const endDate = new Date(booking.end);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        return date >= startDate && date <= endDate;
    });
};

    const isInRange = (date) => {
        if (!checkInDate || !checkOutDate) return false;
        return date > checkInDate && date < checkOutDate;
    };

    const updateTotal = () => {
        if (!checkInDate || !checkOutDate) return;

        const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const guestCount = parseInt(document.getElementById('guestCount').value);
        const roomCount = parseInt(document.getElementById('roomCount').value);
        const basePrice = prices[currentPackage] * roomCount * days;
        
        let additionalServices = 0;
        if (document.getElementById('cateringService').checked) {
            additionalServices += prices.catering * days;
        }
        if (document.getElementById('transportService').checked) {
            additionalServices += prices.transport * days;
        }

        const total = basePrice + additionalServices;
        document.getElementById('totalAmount').textContent = `$${total.toLocaleString()}`;
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

        if (!checkInDate || (checkInDate && checkOutDate)) {
            checkInDate = clickedDate;
            checkOutDate = null;
        } else {
            if (clickedDate <= checkInDate) {
                checkInDate = clickedDate;
            } else {
                checkOutDate = clickedDate;
            }
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
                
                if (checkInDate && date.getTime() === checkInDate.getTime()) {
                    dayNumber.classList.add('selected-checkin');
                } else if (checkOutDate && date.getTime() === checkOutDate.getTime()) {
                    dayNumber.classList.add('selected-checkout');
                } else if (checkInDate && date > checkInDate && (!checkOutDate || date < checkOutDate)) {
                    dayNumber.classList.add('in-range');
                }
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
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            if (parseInt(input.value) > parseInt(input.min)) {
                input.value = parseInt(input.value) - 1;
                updateTotal();
            }
        });
    });

    document.querySelectorAll('.number-input .increase').forEach(button => {
        button.addEventListener('click', function() {
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

    confirmButton?.addEventListener('click', () => {
        if (checkInDate && checkOutDate) {
            const guestCount = document.getElementById('guestCount').value;
            const roomCount = document.getElementById('roomCount').value;
            const catering = document.getElementById('cateringService').checked;
            const transport = document.getElementById('transportService').checked;
            const total = document.getElementById('totalAmount').textContent;
            const calculatedPrice = total.replace(/[^0-9.]/g, '');
            
            // Include all pricing components in the validation URL
            const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)) + 1;
            const basePrice = prices[currentPackage] * roomCount * days;
            const cateringCost = catering ? prices.catering * days : 0;
            const transportCost = transport ? prices.transport * days : 0;
            
            const validationUrl = `/packages.html#${currentPackage}?` + 
                `basePrice=${basePrice}&` +
                `catering=${cateringCost}&` +
                `transport=${transportCost}&` +
                `days=${days}&` +
                `rooms=${roomCount}&` +
                `total=${calculatedPrice}`;
            
            const button = document.createElement('button');
            button.classList.add('snipcart-add-item');
            button.dataset.itemId = currentPackage;
            button.dataset.itemName = `${currentPackage.split('-').map(word => word.charAt(0).toUpperCase())}`;
            button.dataset.itemPrice = calculatedPrice;
            button.dataset.itemUrl = validationUrl;
            button.dataset.itemCustom1Name = "Check-in";
            button.dataset.itemCustom1Value = formatDate(checkInDate);
            button.dataset.itemCustom2Name = "Check-out";
            button.dataset.itemCustom2Value = formatDate(checkOutDate);
            button.dataset.itemCustom3Name = "Guests";
            button.dataset.itemCustom3Value = guestCount;
            button.dataset.itemCustom4Name = "Rooms";
            button.dataset.itemCustom4Value = roomCount;
            button.dataset.itemCustom5Name = "Services";
            button.dataset.itemCustom5Type = "select";
            button.dataset.itemCustom5Options = "None[+0]|Catering Only[+150]|Transport Only[+200]|Both Services[+350]";
            button.dataset.itemCustom5Value = `${catering && transport ? 'Both Services' : 
                                              catering ? 'Catering Only' : 
                                              transport ? 'Transport Only' : 
                                              'None'}`;
    
            button.dataset.itemUniqueId = `${currentPackage}-${Date.now()}`;
            
            document.body.appendChild(button);
            button.click();
            document.body.removeChild(button);
            calendarModal.classList.remove('active');
        }
    });

    calendarModal?.addEventListener('click', (e) => {
        if (e.target === calendarModal) {
            calendarModal.classList.remove('active');
        }
    });
};