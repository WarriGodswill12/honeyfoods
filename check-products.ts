import { prisma } from "./lib/prisma";

async function checkProducts() {
  try {
    const count = await prisma.product.count();
    console.log("Total products in database:", count);

    const products = await prisma.product.findMany({ take: 5 });
    console.log("\nSample products:");
    products.forEach((p) => {
      console.log(`- ${p.name} (${p.price})`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
