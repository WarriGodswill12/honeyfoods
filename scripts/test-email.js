// Quick test script for email notifications
// Run with: node scripts/test-email.js

const nodemailer = require("nodemailer");

async function testEmail() {
  console.log("🧪 Testing email configuration...");

  // SMTP Configuration (copy from your .env)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: "honeycakesandfoods@gmail.com",
      pass: "exuabojlrocqsso",
    },
  });

  try {
    // Test the connection
    console.log("📡 Testing SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection successful!");

    // Send test email
    console.log("📧 Sending test email...");
    const info = await transporter.sendMail({
      from: '"Honey Foods" <honeycakesandfoods@gmail.com>',
      to: "honeycakesandfoods@gmail.com", // Send to yourself
      subject: "🧪 Test Email - Email Notifications Working!",
      html: `
        <h1>✅ Email Test Successful!</h1>
        <p>Your email notifications are working correctly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p>This means order notifications will work properly.</p>
      `,
      text: `Email Test Successful!\n\nYour email notifications are working correctly.\nTimestamp: ${new Date().toISOString()}\n\nThis means order notifications will work properly.`,
    });

    console.log("✅ Test email sent successfully!");
    console.log("📬 Check your inbox:", "honeycakesandfoods@gmail.com");
    console.log("📨 Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Email test failed:", error.message);

    if (error.message.includes("authentication")) {
      console.log("\n💡 Authentication issue - check:");
      console.log("   • Gmail App Password is correct");
      console.log("   • 2-factor authentication is enabled");
    }
  }
}

testEmail();
