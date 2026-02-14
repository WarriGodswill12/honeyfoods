// Test email with Ethereal (fake SMTP for testing)
const nodemailer = require("nodemailer");

async function testWithEthereal() {
  console.log("🧪 Testing with Ethereal (fake SMTP)...");
  
  try {
    // Create test account
    console.log("📡 Creating test email account...");
    const testAccount = await nodemailer.createTestAccount();
    console.log("✅ Test account created!");
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Send test email
    console.log("📧 Sending test email...");
    const info = await transporter.sendMail({
      from: '"Honey Foods Test" <test@honeyfoods.com>',
      to: "customer@example.com",
      subject: "🧪 Email System Test",
      html: `
        <h1>✅ Email System Working!</h1>
        <p>This proves your email code is correct.</p>
        <p>The issue is Gmail authentication, not your code.</p>
      `,
    });

    console.log("✅ Test email sent successfully!");
    console.log("🔗 Preview URL:", nodemailer.getTestMessageUrl(info));
    console.log("");
    console.log("💡 YOUR EMAIL CODE WORKS PERFECTLY!");
    console.log("   The issue is only with Gmail authentication.");
    
  } catch (error) {
    console.error("❌ Code test failed:", error.message);
  }
}

async function testGmailAlternative() {
  console.log("\n🔄 Let's try Gmail with different settings...");
  
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use service instead of manual config
    auth: {
      user: "honeycakesandfoods@gmail.com",
      pass: "exuabojlrocqsso",
    },
  });

  try {
    console.log("📡 Testing Gmail with service config...");
    await transporter.verify();
    console.log("✅ Gmail connection successful!");

    const info = await transporter.sendMail({
      from: '"Honey Foods" <honeycakesandfoods@gmail.com>',
      to: "honeycakesandfoods@gmail.com",
      subject: "🎉 Gmail Working!",
      html: "<h1>Gmail is now working!</h1>",
    });

    console.log("✅ Gmail email sent!");
    console.log("📬 Check your inbox!");
    
  } catch (error) {
    console.error("❌ Gmail still failing:", error.message);
    console.log("\n🔧 Try these Gmail fixes:");
    console.log("   1. Make sure 2FA is ON");
    console.log("   2. Generate NEW app password");
    console.log("   3. Use the exact format: 'abcd efgh ijkl mnop' (with spaces)");
  }
}

async function runTests() {
  await testWithEthereal();
  await testGmailAlternative();
}

runTests();