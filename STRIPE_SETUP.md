# Stripe Payment Integration Setup Guide

## Overview

Your Honeyfoods website now has Stripe payment integration with Apple Pay support! This guide will help you complete the setup.

## What's Been Implemented

✅ **Stripe SDK Integration**

- Installed `stripe` and `@stripe/stripe-js` packages
- Created Stripe client configuration in `lib/stripe.ts`

✅ **Payment Service Layer**

- Payment provider abstraction (`services/payment/types.ts`)
- Stripe provider implementation (`services/payment/stripe-provider.ts`)
- Easy to add more payment providers in the future

✅ **API Routes**

- `/api/payment/create-intent` - Creates Stripe payment intent
- `/api/payment/verify` - Verifies payment completion
- `/api/payment/webhook` - Handles Stripe webhooks
- `/api/orders/create` - Creates order in database

✅ **Frontend Components**

- `PaymentForm` component with Stripe Elements
- Updated checkout page with payment integration
- Supports Apple Pay, Google Pay, and credit cards

## Setup Steps

### 1. Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Create a free account (or log in)
3. Go to Developers → API keys
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Copy your **Secret key** (starts with `sk_test_`)

### 2. Update Environment Variables

Open your `.env` file and replace the placeholder values:

```env
# Replace these with your actual Stripe keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_KEY_HERE"
STRIPE_SECRET_KEY="sk_test_YOUR_KEY_HERE"
```

### 3. Set Up Stripe Webhook (for Production)

1. In Stripe Dashboard, go to Developers → Webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/payment/webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to `.env`:

```env
STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET_HERE"
```

### 4. Test the Payment Flow

#### Development Testing

1. Start your development server:

```bash
npm run dev
```

2. Use Stripe test cards:

   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date (e.g., 12/34)
   - Any 3-digit CVC
   - Any billing ZIP code

3. Test workflow:
   - Add products to cart
   - Go to checkout
   - Fill in customer information
   - Click "Continue to Payment"
   - Complete payment with test card
   - Verify order is created and marked as PAID

#### Testing Apple Pay

Apple Pay only works:

- On Safari browser
- On actual Apple device (iPhone, iPad, Mac)
- With HTTPS (in production)
- When Apple Pay is set up on the device

### 5. Verify Integration

Check these work correctly:

- [ ] Order is created in database
- [ ] Payment intent is created
- [ ] Payment form displays with Apple Pay option (on supported devices)
- [ ] Payment can be completed successfully
- [ ] Order status updates to "CONFIRMED"
- [ ] Payment status updates to "PAID"
- [ ] User is redirected to confirmation page

## Payment Flow Diagram

```
1. User fills checkout form
   ↓
2. Click "Continue to Payment"
   ↓
3. System creates order in database (status: PENDING)
   ↓
4. System creates Stripe payment intent
   ↓
5. Payment form displays (Apple Pay / Card)
   ↓
6. User completes payment
   ↓
7. Stripe processes payment
   ↓
8. System verifies payment
   ↓
9. Order status → CONFIRMED
   Payment status → PAID
   ↓
10. User redirected to order confirmation
```

## Currency Settings

Currently set to **GBP (British Pounds)** for UK customers.

To change currency, update these files:

- `app/api/payment/create-intent/route.ts` - line 33
- `app/api/payment/create-intent/route.ts` - line 47

Example for Nigerian Naira (NGN):

```typescript
currency: "ngn";
```

## Stripe Dashboard Features

Monitor your payments:

- **Payments** - View all transactions
- **Customers** - See customer details
- **Disputes** - Handle chargebacks
- **Balance** - Check your balance
- **Reports** - Download financial reports

## Testing Webhook Locally

Use Stripe CLI for local webhook testing:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login:

```bash
stripe login
```

3. Forward webhooks:

```bash
stripe listen --forward-to localhost:3000/api/payment/webhook
```

4. Get webhook secret and add to `.env`

## Security Notes

🔒 **Never commit sensitive keys to git!**

- Add `.env` to `.gitignore`
- Use environment variables in production
- Rotate keys if accidentally exposed

🔒 **Webhook signature verification**

- Already implemented in `webhook/route.ts`
- Prevents unauthorized webhook calls

## Going Live

When ready for production:

1. Switch to **Live mode** in Stripe Dashboard
2. Get live API keys (start with `pk_live_` and `sk_live_`)
3. Update `.env` with live keys
4. Set up production webhook
5. Test thoroughly with real card
6. Enable Two-factor authentication on Stripe account

## Troubleshooting

### "Invalid API Key"

- Check your `.env` file has correct keys
- Restart dev server after changing `.env`
- Ensure keys match test/live mode

### Apple Pay not showing

- Only works on Apple devices with Safari
- Requires HTTPS in production
- Check Apple Pay is configured on device

### Payment succeeds but order not updating

- Check webhook is configured
- Verify webhook secret in `.env`
- Check server logs for errors

### "Order not found" error

- Ensure database is properly seeded
- Check Prisma connection to Neon database

## Support Resources

- Stripe Documentation: https://stripe.com/docs
- Stripe Testing: https://stripe.com/docs/testing
- Apple Pay Guide: https://stripe.com/docs/apple-pay
- Stripe Support: support@stripe.com

## Next Steps

After setting up Stripe:

1. Test complete checkout flow
2. Verify order emails are sent (if configured)
3. Test on mobile devices
4. Configure order management in admin
5. Set up Stripe webhooks for production
6. Enable additional payment methods if needed

---

**Need Help?** Check the Stripe logs in Dashboard → Developers → Logs for detailed error messages.
