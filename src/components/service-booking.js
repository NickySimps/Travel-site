export const initializeServiceBooking = () => {
    const serviceButtons = document.querySelectorAll('.service-add-cart');
    const serviceDateInputs = document.querySelectorAll('.service-date-input');
    const serviceQuantityInputs = document.querySelectorAll('.service-quantity-input');

    const calculateServiceTotal = (basePrice, days, quantity) => {
        return basePrice * days * quantity;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const updateServiceTotal = (serviceId) => {
        const daysInput = document.querySelector(`#${serviceId}-days`);
        const quantityInput = document.querySelector(`#${serviceId}-quantity`);
        const totalElement = document.querySelector(`#${serviceId}-total`);
        const basePrice = parseFloat(totalElement.dataset.basePrice);

        if (daysInput && quantityInput && totalElement) {
            const days = parseInt(daysInput.value) || 1;
            const quantity = parseInt(quantityInput.value) || 1;
            const total = calculateServiceTotal(basePrice, days, quantity);
            totalElement.textContent = formatCurrency(total);
        }
    };

    // Initialize datepickers for service dates
    serviceDateInputs.forEach(input => {
        input.addEventListener('change', () => {
            const serviceId = input.dataset.serviceId;
            updateServiceTotal(serviceId);
        });
    });

    // Handle quantity changes
    serviceQuantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            const serviceId = input.dataset.serviceId;
            updateServiceTotal(serviceId);
        });
    });

    // Add to cart handling
    serviceButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceId = button.dataset.serviceId;
            const dateInput = document.querySelector(`#${serviceId}-date`);
            const quantityInput = document.querySelector(`#${serviceId}-quantity`);

            if (!dateInput.value) {
                alert('Please select a date');
                return;
            }

            // Update Snipcart button attributes
            button.dataset.itemCustom1Value = dateInput.value;
            button.dataset.itemCustom2Value = quantityInput.value;
            
            // Trigger Snipcart add item
            button.click();
        });
    });
};