# HoneyFoods Admin Panel Guide

**Welcome to the HoneyFoods Admin Panel!** This guide will help you manage your online store efficiently.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Admin Dashboard Overview](#admin-dashboard-overview)
3. [Managing Orders](#managing-orders)
4. [Managing Products](#managing-products)
5. [Managing Gallery](#managing-gallery)
6. [Website Settings](#website-settings)
7. [Tips & Best Practices](#tips--best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Admin Panel

1. Open your web browser
2. Go to: **`https://your-website.com/admin/login`** (or `http://localhost:3000/admin/login` for local testing)
3. You'll see the login page

### Login Credentials

- **Email**: `honeycakesandfoods@gmail.com`
- **Password**: Your admin password (set in your environment configuration)

> **⚠️ Security Note**: Change the default password immediately after your first login!

### First Time Login

1. Enter your admin email and password
2. Click "Sign In"
3. You'll be redirected to the Dashboard
4. The admin header will appear on all admin pages with:
   - Navigation menu
   - Notification bell (shows pending orders)
   - Logout button

---

## Admin Dashboard Overview

### What You'll See

The **Dashboard** is your command center. It shows:

#### 1. Quick Stats Cards (Top Section)

- **Total Products**: Number of products in your store
- **Total Orders**: All orders received
- **Total Revenue**: Money earned from all orders (in GBP £)
- **Pending Orders**: Orders waiting for confirmation

#### 2. Recent Orders Table

Displays the last 5 orders with:

- Order number
- Customer name
- Order amount
- Status badge (color-coded)
- Date/time placed

#### 3. Quick Action Buttons

- **Manage Products**: Jump to products page
- **View Orders**: Jump to orders page
- **Update Settings**: Jump to settings page

### Understanding Order Statuses

Orders can have these statuses (shown with colored badges):

- 🟠 **Pending** (Orange): New order, needs confirmation
- 🔵 **Confirmed** (Blue): Order accepted, being prepared
- 🟣 **Preparing** (Purple): Food is being prepared
- 🟦 **Out for Delivery** (Indigo): On the way to customer
- 🟢 **Delivered** (Green): Successfully delivered
- 🔴 **Cancelled** (Red): Order cancelled

### Notifications

The **bell icon** (🔔) in the header shows:

- Red badge with number of pending orders
- Click to see dropdown with recent pending orders
- Auto-refreshes every 30 seconds
- Click any order to view details

---

## Managing Orders

Navigate to: **Admin Panel → Orders**

### Orders List Page

#### What You See

1. **Stats Cards** at the top:

   - Total Orders
   - Pending Orders (need attention!)
   - Delivered Orders

2. **Orders Table** showing all orders with:
   - Order Number (clickable)
   - Customer Name
   - Items Count
   - Total Amount
   - Status Badge
   - Order Date

#### How to View Order Details

1. **Click on any order row** in the table
2. You'll be taken to the Order Details page

### Order Details Page

This page shows **everything** you need to fulfill an order:

#### Order Header

- Order number (e.g., #ORD-12345)
- Date placed
- Current status badge

#### Order Items Section

**This is crucial for fulfillment!**

Shows a table with:

- **Product**: Image and name of each item
- **Unit Price**: Price per item
- **Quantity**: How many items ordered (highlighted in gold badge)
- **Subtotal**: Total for that item

Example:

```
Product: Jollof Rice
Unit Price: £15.00
Quantity: 2
Subtotal: £30.00
```

#### Order Summary

- Subtotal (all items)
- Delivery Fee
- **Total Amount** (what customer paid)

#### Customer Information

Everything you need to deliver:

- Customer Name
- Email (if provided)
- Phone Number
- Delivery Address
- Delivery Notes (special instructions)

#### Payment Information

- Payment Status (PAID/PENDING/FAILED)
- Payment Method (Stripe)
- Total Amount

#### Order Timeline

- When order was placed
- Last update time

### Updating Order Status

Located in the **right sidebar** of Order Details page:

#### Step-by-Step Process

1. **New Order Comes In**

   - Status: PENDING
   - Action: Review order details
   - Click **"CONFIRMED"** button to accept

2. **Preparing the Order**

   - Status: CONFIRMED
   - Action: Start cooking/preparing
   - Click **"PREPARING"** button

3. **Ready for Delivery**

   - Status: PREPARING
   - Action: Package order
   - Click **"OUT_FOR_DELIVERY"** button

4. **Order Delivered**

   - Status: OUT_FOR_DELIVERY
   - Action: After successful delivery
   - Click **"DELIVERED"** button

5. **If Order Cancelled**
   - Click **"CANCELLED"** button at any time
   - Use for customer cancellations or issues

#### Quick Tips for Order Management

✅ **Always check customer phone number** before preparing order
✅ **Read delivery notes** carefully (allergies, preferences, etc.)
✅ **Update status promptly** so customers know order progress
✅ **Check delivery address** is complete and accurate
✅ **Take note of quantity** - don't miss any items!

---

## Managing Products

Navigate to: **Admin Panel → Products**

### Products List Page

#### What You See

- Grid of all products with:
  - Product image
  - Name
  - Category
  - Price
  - Stock status (In Stock/Out of Stock)
  - Actions (Edit/Delete buttons)

### Adding a New Product

1. Click **"Add New Product"** button (top right)
2. Fill in the form:

#### Required Fields

- **Product Name**: Clear, descriptive name
  - Example: "Nigerian Jollof Rice with Chicken"
- **Description**: Detailed description of the dish

  - Include ingredients, taste profile, serving size
  - Example: "Authentic Nigerian Jollof rice cooked with tomatoes, onions, and spices. Served with grilled chicken. Serves 2-3 people."

- **Price**: In British Pounds (£)

  - Enter numbers only, no currency symbol
  - Example: Enter `1500` for £15.00

- **Category**: Choose from dropdown

  - Main Dishes
  - Sides
  - Desserts
  - Drinks
  - Snacks

- **Product Image**: Upload high-quality image
  - Click "Choose File" or drag & drop
  - Recommended: 800x800 pixels minimum
  - Formats: JPG, PNG
  - Shows food in appetizing way

#### Optional Fields

- **Stock Status**: Toggle In Stock/Out of Stock
- **Featured**: Check to show on homepage

3. Click **"Create Product"** button
4. Product appears in your store immediately!

### Editing a Product

1. Find the product in the list
2. Click **"Edit"** button (pencil icon)
3. Modify any fields
4. Click **"Update Product"**
5. Changes appear instantly on website

### Deleting a Product

1. Click **"Delete"** button (trash icon) on product
2. Confirm deletion in popup
3. Product is removed from store

> **⚠️ Warning**: Deleted products cannot be recovered!

### Product Management Tips

✅ **Use clear, appetizing photos** - customers eat with their eyes first!
✅ **Write detailed descriptions** - mention allergens, spice levels, serving sizes
✅ **Update prices regularly** - especially for ingredients with fluctuating costs
✅ **Mark out of stock** - better than disappointing customers
✅ **Keep at least 10 products** - gives customers good variety

---

## Managing Gallery

Navigate to: **Admin Panel → Gallery**

### Gallery Overview

The gallery showcases your food, restaurant, or events on your website.

### What You See

- Grid of all gallery images
- Each image shows:
  - Preview thumbnail
  - Title (if set)
  - Delete button

### Adding Gallery Images

1. Click **"Add New Image"** button
2. Upload options:
   - Click to browse files
   - Or drag & drop images
3. Can upload multiple images at once
4. Images appear immediately

### Image Guidelines

✅ **Good Gallery Photos**:

- High resolution (at least 1200px wide)
- Well-lit, professional-looking
- Shows food, ambiance, or happy customers
- Landscape orientation works best

❌ **Avoid**:

- Blurry or dark photos
- Photos with text overlays
- Low resolution images
- Unrelated content

### Organizing Gallery

- Newest images appear first
- Rearrange by deleting and re-uploading
- Keep gallery fresh with recent photos

### Deleting Gallery Images

1. Click **delete/trash icon** on image
2. Confirm deletion
3. Image removed from website

### Gallery Tips

✅ **Update regularly** - post new dishes, special events
✅ **Show variety** - different foods, angles, settings
✅ **Maintain quality** - remove old or poor-quality photos
✅ **Tell a story** - show your food journey, behind-the-scenes
✅ **Aim for 15-30 images** - enough variety without overwhelming

---

## Website Settings

Navigate to: **Admin Panel → Settings**

### Settings Overview

This page controls important store-wide settings.

### Delivery Settings

#### Delivery Fee

- Default delivery charge for all orders
- Enter amount in pence (e.g., `1500` = £15.00)
- Applied automatically at checkout

#### Free Delivery Threshold

- Minimum order amount for free delivery
- Example: Set to `5000` (£50.00) to offer free delivery on orders over £50
- Encourages larger orders

#### Minimum Order Amount

- Smallest order you'll accept
- Prevents very small orders
- Example: `500` (£5.00)

### Store Information

Update your business details:

- **Store Name**: Your business name
- **Store Tagline**: Short slogan or description
- **Store Email**: Contact email for customers
- **Store Phone**: Contact phone number
- **Store Address**: Full street address
- **Store City**: Your city
- **Store Postal Code**: Your postcode

> These details appear on:
>
> - Contact page
> - Footer
> - Order confirmations
> - Customer emails

### Visual Settings

#### Hero Background Image

- Large banner image on homepage
- Enter image URL or upload
- Should be 1920x1080 pixels minimum
- Shows brand personality

#### About Us Image

- Image for "About Us" section
- 1200x800 pixels recommended
- Shows your team, kitchen, or story

### Saving Settings

1. Make your changes
2. Scroll to bottom
3. Click **"Save Settings"** button
4. Changes apply immediately to website

### Settings Best Practices

✅ **Review settings monthly** - adjust delivery fees based on costs
✅ **Keep contact info current** - customers need to reach you
✅ **Test free delivery threshold** - find sweet spot for profitability
✅ **Use professional images** - reflects your brand quality
✅ **Announce changes** - tell customers about new delivery fees via social media

---

## Tips & Best Practices

### Daily Routine (Recommended)

**Morning (9 AM)**

1. Log into admin panel
2. Check Dashboard for new orders
3. Review pending orders (notification bell)
4. Confirm all overnight orders
5. Check stock levels

**Throughout the Day**

1. Monitor notifications every hour
2. Update order statuses as you work
3. Respond to any customer notes
4. Mark completed deliveries

**Evening (6 PM)**

1. Review day's orders and revenue
2. Update product stock
3. Plan tomorrow's prep based on orders
4. Log out securely

### Weekly Tasks

**Monday**

- Review last week's revenue
- Update popular products
- Add new seasonal dishes

**Wednesday**

- Check product descriptions for accuracy
- Update gallery with new photos
- Review and respond to any issues

**Friday**

- Plan weekend specials
- Ensure adequate stock
- Update delivery settings if needed

### Monthly Tasks

- Review pricing strategy
- Analyze best-selling products
- Update homepage images
- Check and update settings
- Review order fulfillment times

### Customer Service Excellence

✅ **Respond Quickly**: Update order status within 15 minutes of receiving
✅ **Read Notes**: Always check customer delivery notes
✅ **Communicate**: If running late, inform customer
✅ **Quality Check**: Verify orders before marking "Out for Delivery"
✅ **Follow Up**: Mark delivered only when confirmed

### Security Best Practices

🔒 **Always log out** when done
🔒 **Never share** admin credentials
🔒 **Use strong password** - mix of letters, numbers, symbols
🔒 **Change password** every 3 months
🔒 **Don't login on public WiFi** - use mobile data if needed

---

## Troubleshooting

### Common Issues & Solutions

#### "Can't see new orders"

**Solution**:

1. Check notification bell - click to refresh
2. Refresh browser page (F5 or Ctrl+R)
3. Navigate to Orders page directly
4. Clear browser cache

#### "Product image not uploading"

**Solution**:

1. Check image size (max 10MB)
2. Use JPG or PNG format only
3. Try resizing image to 1200x1200 pixels
4. Check internet connection
5. Try different browser

#### "Can't update order status"

**Solution**:

1. Refresh the page
2. Log out and log back in
3. Check internet connection
4. Try different browser

#### "Settings not saving"

**Solution**:

1. Make sure you clicked "Save Settings" button
2. Check all required fields are filled
3. Refresh page to see if changes applied
4. Clear browser cache

#### "Forgot admin password"

**Solution**:

1. Contact website developer/technical support
2. Password reset needs to be done in environment configuration
3. Never share new password over email

#### "Orders showing wrong total"

**Solution**:

1. Check Settings → Delivery Fee is correct
2. Verify product prices are accurate
3. If issue persists, contact technical support

#### "Website looks different on mobile"

**Solution**:

- This is normal! Website is responsive
- Admin panel optimized for desktop/laptop
- Use larger screen for best admin experience

---

## Need More Help?

### Contact Technical Support

If you encounter issues not covered in this guide:

📧 **Email**: technical-support@honeyfoods.com
📱 **Phone**: +44 7442 932429
💬 **Support Hours**: Monday-Friday, 9 AM - 5 PM

### Additional Resources

- **Stripe Dashboard**: https://dashboard.stripe.com (for payment details)
- **Neon Database**: https://console.neon.tech (for database management - developer access only)

---

## Quick Reference Card

Print this for easy access:

```
┌─────────────────────────────────────────┐
│     HONEYFOODS ADMIN QUICK GUIDE        │
├─────────────────────────────────────────┤
│ LOGIN                                   │
│ URL: /admin/login                       │
│ Email: honeycakesandfoods@gmail.com     │
│                                         │
│ ORDER STATUS FLOW                       │
│ 1. PENDING → 2. CONFIRMED →            │
│ 3. PREPARING → 4. OUT_FOR_DELIVERY →   │
│ 5. DELIVERED                            │
│                                         │
│ DAILY CHECKS                            │
│ ☐ Check pending orders                 │
│ ☐ Confirm new orders                   │
│ ☐ Update order statuses                │
│ ☐ Review delivery addresses            │
│ ☐ Check product stock                  │
│                                         │
│ EMERGENCY CONTACT                       │
│ Phone: +44 7442 932429                  │
│ Email: honeycakesandfoods@gmail.com     │
└─────────────────────────────────────────┘
```

---

## Appendix: Keyboard Shortcuts

Make your workflow faster:

- **Ctrl + R** (Windows) / **Cmd + R** (Mac): Refresh page
- **Ctrl + T** (Windows) / **Cmd + T** (Mac): New tab
- **Ctrl + W** (Windows) / **Cmd + W** (Mac): Close tab
- **F11**: Full screen mode
- **Ctrl + F** (Windows) / **Cmd + F** (Mac): Find on page

---

**Remember**: The admin panel is your business control center. Regular monitoring and timely updates lead to happy customers and a thriving business! 🍯🍰

**Version**: 1.0 | **Last Updated**: January 8, 2026
