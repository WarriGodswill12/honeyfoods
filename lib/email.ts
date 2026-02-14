// Email service using Nodemailer
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

// Create reusable transporter
let transporter: Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    // Check if SMTP credentials are configured
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      console.warn("SMTP credentials not configured. Emails will not be sent.");
      return null;
    }

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      "Email transporter not configured. Email not sent:",
      options.subject,
    );
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "Honey Foods"}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// Email templates
interface OrderDetails {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  customNote?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
    flavor?: string;
    // Calendar fields for cakes
    deliveryDate?: string;
    cakeTitle?: string;
    cakeNote?: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
}

export function generateOrderReceiptHTML(order: OrderDetails): string {
  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        ${item.name}
        ${item.flavor ? `<br><span style="font-size: 12px; color: #6b7280;">Flavor: ${item.flavor}</span>` : ""}
        ${
          item.deliveryDate || item.cakeTitle || item.cakeNote
            ? `
        <div style="margin-top: 8px; padding: 8px; background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 4px;">
          <p style="margin: 0; font-size: 12px; font-weight: 600; color: #c2410c;">🎂 Cake Details:</p>
          ${item.deliveryDate ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #9a3412;">📅 Delivery: ${new Date(item.deliveryDate + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>` : ""}
          ${item.cakeTitle ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #9a3412;">🎉 Event: ${item.cakeTitle}</p>` : ""}
          ${item.cakeNote ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #9a3412;">📝 Note: ${item.cakeNote}</p>` : ""}
        </div>`
            : ""
        }
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">£${item.price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">£${item.subtotal.toFixed(2)}</td>
    </tr>
  `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Order Receipt - ${order.orderNumber}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f9fafb; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #e0a81f 0%, #d4941a 100%); color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Honey Foods</h1>
          <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Order Receipt</p>
        </div>

        <!-- Success Message -->
        <div style="padding: 30px 20px; text-align: center; border-bottom: 1px solid #e5e7eb;">
          <div style="width: 60px; height: 60px; background-color: #10b981; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <span style="font-size: 30px; color: white;">✓</span>
          </div>
          <h2 style="margin: 0 0 10px; font-size: 24px; color: #1f2937;">Thank You for Your Order!</h2>
          <p style="margin: 0; color: #6b7280; font-size: 16px;">Your payment has been received successfully.</p>
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-top: 20px; display: inline-block;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">Order Number</p>
            <p style="margin: 5px 0 0; font-size: 20px; font-weight: bold; color: #e0a81f;">${order.orderNumber}</p>
          </div>
        </div>

        <!-- Order Items -->
        <div style="padding: 30px 20px;">
          <h3 style="margin: 0 0 20px; font-size: 18px; font-weight: 600; color: #1f2937;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #6b7280; font-size: 14px;">Item</th>
                <th style="padding: 12px; text-align: center; font-weight: 600; color: #6b7280; font-size: 14px;">Qty</th>
                <th style="padding: 12px; text-align: right; font-weight: 600; color: #6b7280; font-size: 14px;">Price</th>
                <th style="padding: 12px; text-align: right; font-weight: 600; color: #6b7280; font-size: 14px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <!-- Order Summary -->
          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #6b7280;">
              <span>Subtotal</span>
              <span>£${order.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #6b7280;">
              <span>Delivery Fee</span>
              <span>${order.deliveryFee === 0 ? "FREE" : "£" + order.deliveryFee.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px; font-weight: bold; color: #1f2937; border-top: 2px solid #e5e7eb; margin-top: 8px;">
              <span>Total Paid</span>
              <span style="color: #e0a81f;">£${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <!-- Delivery Information -->
        <div style="padding: 30px 20px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
          <h3 style="margin: 0 0 20px; font-size: 18px; font-weight: 600; color: #1f2937;">Delivery Information</h3>
          <div style="color: #4b5563; line-height: 1.8;">
            <p style="margin: 0 0 10px;"><strong>Name:</strong> ${order.customerName}</p>
            <p style="margin: 0 0 10px;"><strong>Email:</strong> ${order.customerEmail}</p>
            <p style="margin: 0 0 10px;"><strong>Phone:</strong> ${order.customerPhone}</p>
            <p style="margin: 0 0 10px;"><strong>Address:</strong> ${order.deliveryAddress}</p>
            ${order.customNote ? `<p style="margin: 0;"><strong>Notes:</strong> <em>${order.customNote}</em></p>` : ""}
          </div>
        </div>

        <!-- What's Next -->
        <div style="padding: 30px 20px; border-top: 1px solid #e5e7eb;">
          <h3 style="margin: 0 0 20px; font-size: 18px; font-weight: 600; color: #1f2937;">What's Next?</h3>
          <div style="color: #6b7280;">
            <div style="margin-bottom: 16px;">
              <strong style="color: #1f2937;">1. Order Confirmation</strong>
              <p style="margin: 5px 0 0;">We've received your order and payment successfully.</p>
            </div>
            <div style="margin-bottom: 16px;">
              <strong style="color: #1f2937;">2. Preparation</strong>
              <p style="margin: 5px 0 0;">Our team will carefully prepare your delicious food.</p>
            </div>
            <div style="margin-bottom: 16px;">
              <strong style="color: #1f2937;">3. Delivery</strong>
              <p style="margin: 5px 0 0;">We'll deliver your order fresh to your address.</p>
            </div>
            <div>
              <strong style="color: #1f2937;">4. Enjoy!</strong>
              <p style="margin: 5px 0 0;">Enjoy your authentic African and Caribbean cuisine!</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 20px; background-color: #1f2937; color: #9ca3af; text-align: center; font-size: 14px;">
          <p style="margin: 0 0 10px;">Thank you for choosing Honey Foods!</p>
          <p style="margin: 0;">Questions? Contact us at ${process.env.SMTP_FROM_EMAIL || "info@honeycakesandfoods.com"}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateAdminNotificationHTML(order: OrderDetails): string {
  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
        ${item.name}
        ${item.flavor ? `<br><span style="font-size: 11px; color: #6b7280;">Flavor: ${item.flavor}</span>` : ""}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">£${item.subtotal.toFixed(2)}</td>
    </tr>
  `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order - ${order.orderNumber}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background-color: #dc2626; color: white; padding: 24px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🔔 New Order Alert!</h1>
        </div>

        <!-- Order Info -->
        <div style="padding: 24px 20px;">
          <div style="background-color: #fef3c7; border-left: 4px solid #e0a81f; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">Order Number</p>
            <p style="margin: 5px 0 0; font-size: 24px; font-weight: bold; color: #e0a81f;">${order.orderNumber}</p>
            <p style="margin: 10px 0 0; font-size: 14px; color: #92400e;">Received: ${new Date(order.createdAt).toLocaleString("en-GB")}</p>
          </div>

          <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #1f2937;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 8px; text-align: left; font-weight: 600; font-size: 13px;">Item</th>
                <th style="padding: 8px; text-align: center; font-weight: 600; font-size: 13px;">Qty</th>
                <th style="padding: 8px; text-align: right; font-weight: 600; font-size: 13px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; padding: 4px 0;">
              <span>Subtotal</span>
              <span>£${order.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0;">
              <span>Delivery Fee</span>
              <span>£${order.deliveryFee.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 18px; font-weight: bold; border-top: 2px solid #e5e7eb; margin-top: 8px;">
              <span>Total</span>
              <span style="color: #e0a81f;">£${order.total.toFixed(2)}</span>
            </div>
          </div>

          <h3 style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #1f2937;">Customer Details</h3>
          <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; line-height: 1.8;">
            <p style="margin: 0 0 8px;"><strong>Name:</strong> ${order.customerName}</p>
            <p style="margin: 0 0 8px;"><strong>Email:</strong> ${order.customerEmail}</p>
            <p style="margin: 0 0 8px;"><strong>Phone:</strong> ${order.customerPhone}</p>
            <p style="margin: 0 0 8px;"><strong>Address:</strong> ${order.deliveryAddress}</p>
            ${order.customNote ? `<p style="margin: 0;"><strong>Special Notes:</strong> <em>${order.customNote}</em></p>` : ""}
          </div>
        </div>

        <!-- Action Button -->
        <div style="padding: 20px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
          <a href="${process.env.NEXTAUTH_URL}/admin/orders" style="display: inline-block; background-color: #e0a81f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">View Order in Admin Panel</a>
        </div>

        <!-- Footer -->
        <div style="padding: 16px; background-color: #1f2937; color: #9ca3af; text-align: center; font-size: 12px;">
          <p style="margin: 0;">Honey Foods Admin Dashboard</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendOrderReceipt(order: OrderDetails): Promise<boolean> {
  if (!order.customerEmail) {
    console.log("No customer email provided, skipping receipt email");
    return false;
  }

  const html = generateOrderReceiptHTML(order);
  const text = `Thank you for your order!\n\nOrder Number: ${order.orderNumber}\nTotal: £${order.total.toFixed(2)}\n\nWe'll deliver your order to: ${order.deliveryAddress}\n\nThank you for choosing Honey Foods!`;

  return sendEmail({
    to: order.customerEmail,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html,
    text,
  });
}

export async function sendAdminNotification(
  order: OrderDetails,
): Promise<boolean> {
  // Use SMTP_FROM_EMAIL or SMTP_USER as the admin notification email
  // ADMIN_EMAIL is for login credentials only
  const adminEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  if (!adminEmail) {
    console.warn(
      "Admin notification email not configured. Set SMTP_FROM_EMAIL or SMTP_USER in .env to receive order notifications.",
    );
    return false;
  }

  const html = generateAdminNotificationHTML(order);
  const text = `New Order Received!\n\nOrder Number: ${order.orderNumber}\nCustomer: ${order.customerName}\nTotal: £${order.total.toFixed(2)}\n\nView order at: ${process.env.NEXTAUTH_URL}/admin/orders`;

  return sendEmail({
    to: adminEmail,
    subject: `🔔 New Order: ${order.orderNumber}`,
    html,
    text,
  });
}

// Pickup ready notification
interface PickupReadyDetails {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export async function sendPickupReadyNotification(
  pickup: PickupReadyDetails,
): Promise<boolean> {
  if (!pickup.customerEmail) {
    console.log("No customer email provided, skipping pickup notification");
    return false;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Order Ready for Pickup</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f9fafb; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700;">🎉 Order Ready!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Your order is ready for pickup</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Hello ${pickup.customerName},
          </p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            Great news! Your order <strong>${pickup.orderNumber}</strong> is now ready for pickup.
          </p>

          <div style="background-color: #f3f4f6; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #4b5563;">
              <strong>📍 Pickup Location:</strong><br>
              Please visit our store during business hours to collect your order.<br>
              Don't forget to bring your order number: <strong>${pickup.orderNumber}</strong>
            </p>
          </div>

          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
            If you have any questions, please contact us at ${pickup.customerPhone}
          </p>

          <p style="font-size: 16px; margin-top: 30px;">
            Thank you for choosing Honey Foods!
          </p>
        </div>

        <!-- Footer -->
        <div style="padding: 20px; background-color: #1f2937; color: #9ca3af; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Honey Foods. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">Questions? Contact us at ${process.env.SMTP_FROM_EMAIL || "info@honeycakesandfoods.com"}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Order Ready for Pickup!\n\nHello ${pickup.customerName},\n\nYour order ${pickup.orderNumber} is now ready for pickup.\n\nPlease visit our store during business hours to collect your order.\n\nThank you for choosing Honey Foods!`;

  return sendEmail({
    to: pickup.customerEmail,
    subject: `🎉 Order Ready for Pickup - ${pickup.orderNumber}`,
    html,
    text,
  });
}
