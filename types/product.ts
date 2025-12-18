// TypeScript types for products

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  featured: boolean;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  imagePublicId?: string;
  available?: boolean;
  featured?: boolean;
  category?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}
