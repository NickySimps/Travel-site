const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const FormData = require("form-data"); // Required for mailgun.js
const Mailgun = require("mailgun.js"); // Mailgun SDK

// Initialize Mailgun client
const mailgun = new Mailgun(FormData);
let mg; // Declare mg here to be initialized after config is loaded

// IMPORTANT: Set your Mailgun API Key and Domain in Firebase environment configuration
// Run:
// firebase functions:config:set mailgun.key="YOUR_MAILGUN_API_KEY"
// firebase functions:config:set mailgun.domain="YOUR_MAILGUN_DOMAIN"
//
// Example of how you would have set your specific config (DO NOT COMMIT ACTUAL KEYS):
// firebase functions:config:set mailgun.key="PASTE_YOUR_ACTUAL_KEY_IN_TERMINAL_ONLY"
// firebase functions:config:set mailgun.domain="PASTE_YOUR_ACTUAL_DOMAIN_IN_TERMINAL_ONLY"
// For local testing, you might set it directly (not recommended for production)
// const API_KEY = "YOUR_MAILGUN_API_KEY";
// const DOMAIN = "YOUR_MAILGUN_DOMAIN";
//
// Also set your admin email:
// firebase functions:config:set app.admin_email="your-admin-email@example.com"

// Note: For Mailgun sandbox, 'to' emails must be authorized recipients.
exports.sendOrderConfirmationEmail = functions.firestore
    .document("orders/{orderId}")
    .onCreate(async (snap, context) => {
      const orderData = snap.data();
      const orderId = context.params.orderId; // This is the document ID (orderRef in our case)

      console.log(`New order received: ${orderId}`, JSON.stringify(orderData));

      // Initialize Mailgun client with config values
      // This is done inside the function to ensure config is loaded
      if (!mg) {
        mg = mailgun.client({
            username: "api",
            // key: API_KEY, // For local testing if not using firebase config
            key: functions.config().mailgun.key,
        });
      }

      const itemsHtml = orderData.items
          .map(
              (item) =>
                `<li>
                    <img src="${item.imgSrc || ""}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; vertical-align: middle; margin-right: 10px;">
                    ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}
                 </li>`,
          )
          .join("");

      const orderPlacedDate = orderData.timestamp && orderData.timestamp.toDate ?
        new Date(orderData.timestamp.toDate()).toLocaleString() :
        new Date().toLocaleString();

      const mailgunDomain = functions.config().mailgun.domain;
      const adminEmail = functions.config().app.admin_email || "fallback-admin-email@example.com"; // Fallback just in case

      // Email to User
      const userEmailPayload = {
        // For sandbox, use `postmaster@YOUR_SANDBOX_DOMAIN` or a verified sender
        from: `USVI Retreats <postmaster@${mailgunDomain}>`,
        to: [orderData.userEmail], // Mailgun expects an array of recipients
        subject: `Your USVI Retreats Order Confirmation - #${orderData.orderRef}`,
        html: `
            <h1>Thank You for Your Order, ${orderData.userName}!</h1>
            <p>Your order (Ref: <strong>${orderData.orderRef}</strong>) has been received and is being processed.</p>
            <h2>Order Summary:</h2>
            <ul>${itemsHtml}</ul>
            <p><strong>Total: $${orderData.totalAmount.toFixed(2)}</strong></p>
            <h3>Shipping & Contact Details:</h3>
            <p>
                Name: ${orderData.userName}<br>
                Email: ${orderData.userEmail}<br>
                Phone: ${orderData.userPhone || "N/A"}<br>
                Address: ${orderData.userAddress || "N/A"}<br>
                Payment Method: ${orderData.paymentMethod || "N/A"}
            </p>
            <p>Order Placed: ${orderPlacedDate}</p>            
            <p>If you have any questions, please contact us at ${adminEmail}.</p>
            <p>Thanks,<br>The USVI Retreats Team</p>
        `,
      };

      // Email to Admin
      const adminEmailPayload = {
        from: `USVI Retreats System <postmaster@${mailgunDomain}>`,
        // Ensure ADMIN_EMAIL is an authorized recipient if using Mailgun sandbox
        to: [adminEmail],
        subject: `New Order Received - #${orderData.orderRef}`,
        html: `
            <h1>New Order Received!</h1>
            <p>Order Reference: <strong>${orderData.orderRef}</strong></p>
            <h2>Customer Details:</h2>
            <p>
                Name: ${orderData.userName}<br>
                Email: ${orderData.userEmail}<br>
                Phone: ${orderData.userPhone || "N/A"}<br>
                Address: ${orderData.userAddress || "N/A"}<br>
                Payment Method: ${orderData.paymentMethod || "N/A"}
            </p>
            <h2>Order Items:</h2>
            <ul>${itemsHtml}</ul>
            <p><strong>Total: $${orderData.totalAmount.toFixed(2)}</strong></p>
            <p>Order Placed: ${orderPlacedDate}</p>
            <p>Please process this order via your admin panel or internal system.</p>
        `,
      };

      try {
        await mg.messages.create(mailgunDomain, userEmailPayload);
        console.log(`User confirmation email sent to ${orderData.userEmail} for order ${orderId}`);
        await mg.messages.create(mailgunDomain, adminEmailPayload);
        console.log(`Admin notification email sent to ${adminEmail} for order ${orderId}`);
        await snap.ref.update({ status: "confirmation_sent", emailSentTimestamp: admin.firestore.FieldValue.serverTimestamp() });
      } catch (error) {
        console.error(`Error sending emails for order ${orderId}:`, error.status, error.message, error.details);
        await snap.ref.update({ status: "email_failed", emailError: error.message });
      }
      return null;
    });