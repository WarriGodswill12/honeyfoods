import { prisma } from "@/lib/prisma";

async function seedGallery() {
  // Check if data already exists
  const count = await prisma.galleryImage.count();
  if (count > 0) {
    console.log("Gallery already seeded");
    return;
  }

  const images = await prisma.galleryImage.createMany({
    data: [
      // Hero slides
      {
        type: "hero",
        url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1920&q=80",
        alt: "Jollof Rice",
        order: 1,
      },
      {
        type: "hero",
        url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&q=80",
        alt: "Custom Cakes",
        order: 2,
      },
      {
        type: "hero",
        url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80",
        alt: "Fresh Pastries",
        order: 3,
      },
      {
        type: "hero",
        url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=80",
        alt: "Party Platter",
        order: 4,
      },
      // Gallery images
      {
        type: "gallery",
        url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
        alt: "Delicious Jollof Rice",
        order: 1,
      },
      {
        type: "gallery",
        url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
        alt: "Beautiful Custom Cake",
        order: 2,
      },
      {
        type: "gallery",
        url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
        alt: "Fresh Pastries Display",
        order: 3,
      },
    ],
  });

  console.log(`Seeded ${images.count} gallery images`);
}

seedGallery().catch(console.error);
