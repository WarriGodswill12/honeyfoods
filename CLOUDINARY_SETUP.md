# Cloudinary Setup Guide 📸

This guide will help you set up Cloudinary for image uploads in your Honeyfoods application.

## Step 1: Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Click "Sign Up For Free"
3. Complete the registration process

## Step 2: Get Your Credentials

1. After logging in, go to your **Dashboard**
2. You'll see your account details at the top:
   - **Cloud name**
   - **API Key**
   - **API Secret**

## Step 3: Add Credentials to .env

Open your `.env` file and update these values:

```env
# Cloudinary Image Upload
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name_here"
CLOUDINARY_API_KEY="your_api_key_here"
CLOUDINARY_API_SECRET="your_api_secret_here"
```

**Example:**

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="honeyfoods"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz123456"
```

## Step 4: Configure Upload Presets (Optional)

For better security, you can create upload presets:

1. Go to **Settings** → **Upload**
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. Set:

   - **Preset name**: `honeyfoods-hero` (for hero images)
   - **Signing Mode**: Signed
   - **Folder**: `honeyfoods/hero`
   - **Transformation**: Width 1920, Height 1080, Crop: Limit

5. Create another preset for about us images:
   - **Preset name**: `honeyfoods-about`
   - **Folder**: `honeyfoods/about`

## Step 5: Test the Upload

1. Restart your development server: `npm run dev`
2. Go to `/admin/gallery`
3. Scroll to "Page Images" section
4. Click "Choose File" under Hero Background Image
5. Select an image and upload
6. You should see the image preview appear immediately

## Features

### Automatic Optimizations

Cloudinary automatically:

- Converts images to WebP/AVIF for modern browsers
- Compresses images for optimal file size
- Generates responsive image sizes
- Provides CDN delivery for fast loading

### Image Transformations

The upload API automatically applies:

- **Max dimensions**: 1920x1080 (maintains aspect ratio)
- **Quality**: Auto-optimized
- **Format**: Auto-converted to best format

### Security

- File type validation (only JPEG, PNG, WebP allowed)
- File size limit (10MB maximum)
- Server-side upload (API keys never exposed to client)

## Folder Structure

Your images are organized in Cloudinary:

```
honeyfoods/
├── hero/          # Hero background images
├── about/         # About us section images
├── products/      # Product images (future)
└── gallery/       # Gallery images (future)
```

## Troubleshooting

### Error: "Invalid credentials"

- Check that your API key and secret are correct
- Make sure there are no extra spaces in .env
- Restart the dev server after changing .env

### Error: "File too large"

- Maximum file size is 10MB
- Compress your image before uploading
- Recommended: Use images under 5MB

### Error: "Invalid file type"

- Only JPEG, PNG, and WebP are supported
- Convert your image to one of these formats
- Recommended: Use JPEG for photos, PNG for graphics

### Upload is slow

- Check your internet connection
- Try a smaller image (under 2MB recommended)
- Cloudinary's free tier has bandwidth limits

## Free Tier Limits

Cloudinary free plan includes:

- **Storage**: 25 GB
- **Bandwidth**: 25 GB per month
- **Transformations**: 25,000 per month
- **Admin API calls**: 500 per hour

More than enough for a small business website!

## Going to Production

Before deploying:

1. ✅ Add real Cloudinary credentials to production .env
2. ✅ Keep API keys in environment variables (never commit to git)
3. ✅ Test image uploads in production environment
4. ✅ Monitor usage in Cloudinary dashboard

## Cost Optimization Tips

1. **Compress images before upload** - Save bandwidth and storage
2. **Use appropriate dimensions** - Don't upload 4K images if you only need 1080p
3. **Delete unused images** - Clean up old images from Cloudinary dashboard
4. **Monitor usage** - Check Cloudinary dashboard monthly

---

**Your image upload system is now ready!** 🎉

The admin can now upload images directly in the gallery management page, and they'll be automatically optimized and delivered via Cloudinary's CDN.
