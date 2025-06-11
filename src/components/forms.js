import { CONFIG } from "./config.js";
import { validateEmail, validatePhone } from "./utils.js";

export const initializeForms = () => {
  const newsletterForm = document.querySelector(CONFIG.UI.newsletterForm);
  const retreatForm = document.querySelector(CONFIG.UI.retreatForm);

  const creativeRetreatApplicationForm = document.getElementById(
    "creativeRetreatForm"
  );

  newsletterForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    // Use specific IDs for newsletter form inputs
    const emailInput = newsletterForm.querySelector("#newsletter-email");
    const phoneInput = newsletterForm.querySelector("#newsletter-phone");
    const firstNameInput = newsletterForm.querySelector("#firstName");
    const lastNameInput = newsletterForm.querySelector("#lastName");

    let isValid = true;
    let errorMessages = [];

    if (!firstNameInput || !firstNameInput.value.trim()) {
      isValid = false;
      errorMessages.push("First name is required.");
    }
    if (!lastNameInput || !lastNameInput.value.trim()) {
      isValid = false;
      errorMessages.push("Last name is required.");
    }

    if (!emailInput || !validateEmail(emailInput.value)) {
      isValid = false;
      errorMessages.push("Please enter a valid email address.");
    }
    if (!phoneInput || !validatePhone(phoneInput.value)) {
      isValid = false;
      errorMessages.push("Please enter a valid phone number.");
    }

    if (!isValid) {
      alert(
        "Please correct the following errors:\n- " + errorMessages.join("\n- ")
      );
      return;
    }

    alert("Thank you for subscribing!");
    newsletterForm.reset(); // Optionally reset the form
  });

  retreatForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inquiryDetails = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      specialRequests: formData.get("specialRequests"),
      // You would also include bookingSummary details here, passed from booking.js or retrieved
    };

    console.log("Retreat Inquiry Submitted:", inquiryDetails);
    alert("Thank you for your inquiry! We will get back to you soon.");
    // TODO: Replace mailto with an actual backend submission (e.g., to a Firebase Cloud Function)
    // Example: sendInquiryToBackend(inquiryDetails);
    retreatForm.reset(); // Optionally reset the form
  });

  creativeRetreatApplicationForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const applicationDetails = {
      fullName: formData.get("fullName")?.trim(),
      email: formData.get("email")?.trim(),
      phone: formData.get("phone")?.trim(),
      location: formData.get("location")?.trim(),
      retreatDates: formData.get("retreatDates"),
      whatYouCreate: formData.get("whatYouCreate")?.trim(),
      craft: formData.get("craft")?.trim(),
      mostAlive: formData.get("mostAlive")?.trim(),
      whyDrawn: formData.get("whyDrawn")?.trim(),
      connection: formData.get("connection")?.trim(),
      hopeToReturn: formData.get("hopeToReturn")?.trim(),
      accessibility: formData.get("accessibility")?.trim(),
      paymentPreference: formData.get("paymentPreference"),
      anythingElse: formData.get("anythingElse")?.trim(),
    };

    let isValid = true;
    let errorMessages = [];

    if (!applicationDetails.fullName) {
      errorMessages.push("Full Name is required.");
      isValid = false;
    }
    if (!applicationDetails.email || !validateEmail(applicationDetails.email)) {
      errorMessages.push("A valid Email is required.");
      isValid = false;
    }
    if (!applicationDetails.location) {
      errorMessages.push("Location is required.");
      isValid = false;
    }
    if (!applicationDetails.retreatDates) {
      errorMessages.push("Retreat dates selection is required.");
      isValid = false;
    }
    if (!applicationDetails.whatYouCreate) {
      errorMessages.push(
        'Response for "What do you create, build or lead?" is required.'
      );
      isValid = false;
    }
    if (!applicationDetails.craft) {
      errorMessages.push(
        'Response for "What do you consider your craft?" is required.'
      );
      isValid = false;
    }
    if (!applicationDetails.mostAlive) {
      errorMessages.push(
        'Response for "Where do you feel most alive?" is required.'
      );
      isValid = false;
    }
    if (!applicationDetails.whyDrawn) {
      errorMessages.push(
        'Response for "Why are you drawn to this retreat?" is required.'
      );
      isValid = false;
    }
    if (!applicationDetails.connection) {
      errorMessages.push(
        'Response for "What kind of connection are you craving?" is required.'
      );
      isValid = false;
    }
    if (!applicationDetails.hopeToReturn) {
      errorMessages.push(
        'Response for "What do you hope to return with?" is required.'
      );
      isValid = false;
    }
    if (!applicationDetails.paymentPreference) {
      errorMessages.push("Payment preference is required.");
      isValid = false;
    }

    if (!isValid) {
      alert(
        "Please correct the following errors:\n- " + errorMessages.join("\n- ")
      );
      return;
    }

    console.log("Creative Retreat Application Submitted:", applicationDetails);
    // Here you would typically send the data to a backend service or email
    // For example, using EmailJS if configured:
    // emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', applicationDetails)
    //   .then((response) => {
    //      console.log('SUCCESS!', response.status, response.text);
    //      alert('Thank you for your application! We will review it and get back to you soon.');
    //      creativeRetreatApplicationForm.reset();
    //   }, (error) => {
    //      console.log('FAILED...', error);
    //      alert('Failed to submit application. Please try again or contact us directly.');
    //   });
    alert(
      "Thank you for your application! We will review it and get back to you soon.\n(Data logged to console)"
    );
    creativeRetreatApplicationForm.reset();
  });

  // Pre-fill form data if available
  if (creativeRetreatApplicationForm) {
    // Attempt to pre-fill Email from Auth (assuming auth module exposes currentUser)
    if (window.currentUser && window.currentUser.email) {
      const emailInput =
        creativeRetreatApplicationForm.querySelector("#crEmail");
      if (emailInput) emailInput.value = window.currentUser.email;
    }

    // Attempt to pre-fill Retreat Dates from Cart (conceptual)
    // This requires window.shoppingCart and a getCartItems method,
    // and cart items for retreats to have specific date information.
    if (
      window.shoppingCart &&
      typeof window.shoppingCart.getCartItems === "function"
    ) {
      const cartItems = window.shoppingCart.getCartItems();
      // Example: Find an "Artist Retreat" item and try to match its dates
      const artistRetreatInCart = cartItems.find(
        (item) =>
          item.name?.toLowerCase().includes("artist retreat") &&
          item.bookingDetails?.checkIn
      );

      if (artistRetreatInCart) {
        const retreatDatesDropdown =
          creativeRetreatApplicationForm.querySelector("#crRetreatDates");
        // This is a placeholder. Actual logic to match cart dates to dropdown options would be complex.
        // It depends on the format of dates in cart and option values.
        // For now, we'll just log that we found it.
        console.log(
          `Artist retreat found in cart with check-in: ${artistRetreatInCart.bookingDetails.checkIn}. Consider pre-selecting in dropdown if a match exists.`
        );
        // Example: If dropdown option values are like "YYYY-MM-DD_YYYY-MM-DD"
        // const cartDateValue = `${new Date(artistRetreatInCart.bookingDetails.checkIn).toISOString().split('T')[0]}_${new Date(artistRetreatInCart.bookingDetails.checkOut).toISOString().split('T')[0]}`;
        // if (retreatDatesDropdown.querySelector(`option[value="${cartDateValue}"]`)) {
        //   retreatDatesDropdown.value = cartDateValue;
        // }
      }
    }
  }
};
