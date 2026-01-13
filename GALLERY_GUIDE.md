# Gallery Management Guide

## Overview

The gallery is a feature that displays a collection of images showcasing your food, cakes, and dishes. Only images with `type: "gallery"` are displayed on the customer-facing gallery page.

## How to Add Gallery Images

### Option 1: Using the Admin Panel (Recommended)

1. **Log in to Admin Dashboard**

   - Go to `/admin/dashboard`
   - Sign in with your admin credentials

2. **Navigate to Gallery**

   - Click on "Gallery" in the left sidebar
   - You'll see the gallery management page

3. **Add a New Image**

   - Click the **"+ Add Image"** button
   - Fill in the form:
     - **Image URL**: Paste the URL of your image (from Cloudinary, Unsplash, or your own server)
     - **Alt Text**: Describe the image for accessibility (e.g., "Chocolate cake with berries")
     - **Type**: Select "Gallery" to display on customer gallery page
     - **Order**: Number to control display order (1, 2, 3, etc.)
   - Click **"Add Image"** to save

4. **Edit Existing Images**

   - Click the edit icon on any image card
   - Modify the details
   - Click **"Save"** to update

5. **Delete Images**
   - Click the delete icon on any image card
   - Confirm the deletion

### Option 2: Using Database Seeding (For Initial Setup)

If you have many images to add initially, you can use the seed script:

```bash
# Run the seeding script
npx ts-node scripts/seed-gallery.ts
```

This will populate the gallery with sample images from Unsplash.

### Option 3: Direct Database Insert (Advanced)

If you have direct database access, you can insert images:

```sql
INSERT INTO "GalleryImage" (id, type, url, alt, "order", "createdAt", "updatedAt")
VALUES
  (
    gen_random_uuid()::text,
    'gallery',
    'https://your-image-url.com/image.jpg',
    'Image description',
    1,
    NOW(),
    NOW()
  );
```

## Image URL Sources

### Free Stock Photos

- **Unsplash**: https://unsplash.com (Free professional photos)
- **Pexels**: https://pexels.com (Free stock photos)
- **Pixabay**: https://pixabay.com (Free images and vectors)

### Your Own Images

- **Cloudinary**: Upload images via the admin panel (recommended)

  - Go to Admin → Products → Upload Image
  - Get the URL from Cloudinary
  - Use that URL in the gallery

- **Direct Upload**: If you have your own server/storage

## Image Guidelines

### Recommended Image Specs

- **Dimensions**: 800x800px or similar square ratio (1:1)
- **File Size**: Under 500KB for optimal performance
- **Format**: JPG, PNG, or WebP
- **Quality**: High resolution (at least 72 DPI)

### Best Practices

1. **Use Descriptive Alt Text**: Helps with SEO and accessibility

   - ✅ "Homemade chocolate cake with cream cheese frosting"
   - ❌ "cake" or "food"

2. **Organize by Order**: Set order numbers sequentially (1, 2, 3...)

   - Images display in ascending order

3. **Consistent Style**: Use images with similar lighting and quality

   - Creates a cohesive gallery look

4. **Avoid Too Many Images**: 6-12 images work best
   - Keeps the page fast and focused

## Troubleshooting

### Gallery Page Shows "No images yet"

**Problem**: You uploaded images but they don't show in the customer gallery

**Solutions**:

1. **Check the image type**: Make sure images have `type: "gallery"` (not "hero")
2. **Verify the URL**: Click the image in the admin panel - if it doesn't load, the URL is broken
3. **Clear browser cache**: Hard refresh the page (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)
4. **Check database**: Verify images exist in the database
   ```sql
   SELECT * FROM "GalleryImage" WHERE type = 'gallery';
   ```

### Images Not Loading

**Problem**: Images show broken icon or don't display

**Solutions**:

1. **Check the URL**: Make sure the URL is accessible (not behind login or blocked)
2. **Verify CORS**: If using external domain, ensure CORS is enabled
3. **Test the URL**: Paste the image URL directly in browser to test
4. **Use HTTPS**: Some browsers block HTTP images on HTTPS pages
   - Try using HTTPS URLs instead

### Slow Gallery Loading

**Problem**: Gallery takes too long to load

**Solutions**:

1. **Reduce image count**: Fewer images = faster loading
2. **Optimize images**: Compress images before uploading
3. **Use CDN**: Cloudinary automatically optimizes and serves from CDN
4. **Check file sizes**: Ensure images are under 500KB each

## Image Types

The gallery system supports two image types:

### 1. Gallery Images (`type: "gallery"`)

- Displayed on `/gallery` page
- Customer-facing collection
- What to use: Food photos, cakes, dishes, party platters

### 2. Hero Images (`type: "hero"`)

- Displayed on homepage carousel
- Large hero section images
- What to use: Wide promotional images

## Admin Gallery Page Features

### View All Images

- See all gallery images in a grid
- Shows preview thumbnail, alt text, and order number

### Search & Filter

- Filter by type: "Gallery" or "Hero"
- Search by alt text

### Batch Operations

- Coming soon: Bulk upload, bulk delete
- Currently: One-by-one operations

### Sorting

- Drag to reorder (coming soon)
- Manual order numbers currently used

## Integration with Homepage

Gallery images with `type: "gallery"` are automatically displayed on:

- `/gallery` page - Full collection view
- **Not** on homepage (homepage uses different images)

## API Reference

### Get Gallery Images

```bash
curl "https://yourdomain.com/api/gallery?type=gallery"
```

Response:

```json
[
  {
    "id": "clxxxx",
    "type": "gallery",
    "url": "https://...",
    "alt": "Image description",
    "order": 1,
    "createdAt": "2024-01-13T...",
    "updatedAt": "2024-01-13T..."
  }
]
```

### Add Gallery Image (Admin Only)

```bash
curl -X POST "https://yourdomain.com/api/gallery" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "gallery",
    "url": "https://...",
    "alt": "Image description",
    "order": 1
  }'
```

### Update Gallery Image (Admin Only)

```bash
curl -X PATCH "https://yourdomain.com/api/gallery/{id}" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "alt": "New description",
    "order": 2
  }'
```

### Delete Gallery Image (Admin Only)

```bash
curl -X DELETE "https://yourdomain.com/api/gallery/{id}" \
  -H "Authorization: Bearer <admin-token>"
```

## Common Tasks

### Add 5 Images Quickly

1. Prepare 5 image URLs (from Cloudinary or Unsplash)
2. Go to Admin → Gallery
3. Click "Add Image" for each URL
4. Paste URL, add alt text, set order
5. Click "Add Image"
6. Repeat 4 more times

### Change Gallery Order

1. Go to Admin → Gallery
2. Click edit on an image
3. Change the "Order" number
4. Click "Save"
5. Refresh gallery page to see new order

### Delete All Gallery Images

1. Go to Admin → Gallery
2. Click delete on each image
3. Confirm deletion
4. Repeat for all images

_Note: Consider taking a backup before bulk deleting_

---

**Questions?** Contact support or check the troubleshooting section above.
