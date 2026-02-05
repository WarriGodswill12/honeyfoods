"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ImageIcon,
  AlertCircle,
  Trash,
  LayoutDashboard,
  CheckCircle2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import Image from "next/image";

export default function ProductsPage() {
  const allProducts = useQuery(api.products.getProducts, {});
  const createProduct = useMutation(api.products.createProduct);
  const updateProduct = useMutation(api.products.updateProduct);
  const deleteProduct = useMutation(api.products.deleteProduct);
  const deleteAllProducts = useMutation(api.products.deleteAllProducts);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  // Get products and filter them
  const products = allProducts || [];

  // Get unique categories from existing products
  const existingCategories = useMemo(() => {
    const categories = products
      .map((p) => p.category)
      .filter((cat): cat is string => cat !== undefined && cat.trim() !== "");
    return Array.from(new Set(categories)).sort();
  }, [products]);
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [products, searchQuery]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    images: [] as string[],
    imagePublicIds: [] as string[],
    featured: false,
    available: true,
  });

  // Check if form is valid for submission
  const isFormValid = () => {
    const hasRequiredFields =
      formData.name.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.price !== "" &&
      formData.category.trim() !== "" &&
      (formData.images.length > 0 || formData.image.trim() !== "");

    return hasRequiredFields && !isUploadingImage;
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      images: [],
      imagePublicIds: [],
      featured: false,
      available: true, // Default to shop product
    });
    setError("");
    setIsAddingNewCategory(false);
    setCustomCategory("");
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(), // Already in pounds
      category: product.category,
      image: product.image,
      images: product.images || [],
      imagePublicIds: product.imagePublicIds || [],
      featured: product.featured,
      available: product.available,
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const productData = {
        name: formData.name.trim(),
        slug: formData.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        description: formData.description.trim() || undefined,
        price: parseFloat(formData.price), // Store directly in pounds
        category: formData.category.trim(),
        image: formData.image.trim(),
        images: formData.images.length > 0 ? formData.images : undefined,
        imagePublicIds:
          formData.imagePublicIds.length > 0
            ? formData.imagePublicIds
            : undefined,
        featured: formData.featured,
        available: formData.available,
      };

      if (editingProduct) {
        await updateProduct({
          id: editingProduct._id as Id<"products">,
          ...productData,
        });
      } else {
        await createProduct(productData);
      }

      setIsModalOpen(false);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product: any) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);

    try {
      await deleteProduct({ id: productToDelete._id as Id<"products"> });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearAll = async () => {
    setIsClearing(true);

    try {
      await deleteAllProducts();
      setIsClearDialogOpen(false);
    } catch (error: any) {
      alert(error.message || "Failed to clear products");
    } finally {
      setIsClearing(false);
    }
  };

  if (products === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList className="flex items-center">
            <BreadcrumbItem className="flex items-center">
              <BreadcrumbLink
                href="/admin/dashboard"
                className="flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="flex items-center" />
            <BreadcrumbItem className="flex items-center">
              <BreadcrumbPage className="font-semibold">
                Products
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-4xl font-bold text-charcoal-black mb-2">
            Products
          </h1>
          <p className="text-gray-600">
            Manage your product catalog ({products.length} total)
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="lg">
                <Trash className="h-5 w-5 mr-2" />
                Clear All
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear All Products</DialogTitle>
                <DialogDescription>
                  Are you absolutely sure? This will permanently delete all{" "}
                  {products.length} products from your catalog. This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsClearDialogOpen(false)}
                  disabled={isClearing}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleClearAll}
                  disabled={isClearing}
                >
                  {isClearing ? "Clearing..." : "Yes, Clear All Products"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={openAddModal} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </Button>
        </div>
      </div>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey-gold"
          />
        </div>
      </div>
      {/* Products Grid */}
      {allProducts === undefined ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-bold text-charcoal-black mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? "Try a different search term"
              : "Get started by adding your first product"}
          </p>
          {!searchQuery && (
            <Button onClick={openAddModal}>
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product._id} className="overflow-hidden">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={product.image || "/images/placeholder-product.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/placeholder-product.svg";
                  }}
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  {product.featured && (
                    <Badge variant="primary">Featured</Badge>
                  )}
                  {!product.available && (
                    <Badge variant="secondary">Unavailable</Badge>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-heading text-xl font-bold text-charcoal-black mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {product.category}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="font-heading text-2xl font-bold text-honey-gold">
                    £{product.price.toFixed(2)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(product)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {/* Add/Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add New Product"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <Input
            label="Product Name"
            placeholder="e.g. Chocolate Cake"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={isSubmitting}
          />

          <Textarea
            label="Description"
            placeholder="Describe your product..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            disabled={isSubmitting}
            rows={4}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (€)"
              type="number"
              placeholder="5000"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
              disabled={isSubmitting}
              min="0"
              step="0.01"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>

              {!isAddingNewCategory ? (
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    if (value === "__add_new__") {
                      setIsAddingNewCategory(true);
                    } else {
                      setFormData({ ...formData, category: value });
                    }
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {existingCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                    {existingCategories.length > 0 && <SelectSeparator />}
                    <SelectItem value="__add_new__">
                      + Add New Category
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter new category name"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && customCategory.trim()) {
                        e.preventDefault();
                        setFormData({
                          ...formData,
                          category: customCategory.trim(),
                        });
                        setIsAddingNewCategory(false);
                        setCustomCategory("");
                      }
                    }}
                    disabled={isSubmitting}
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (customCategory.trim()) {
                        setFormData({
                          ...formData,
                          category: customCategory.trim(),
                        });
                        setIsAddingNewCategory(false);
                        setCustomCategory("");
                      }
                    }}
                    disabled={!customCategory.trim() || isSubmitting}
                    className="shrink-0"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddingNewCategory(false);
                      setCustomCategory("");
                    }}
                    disabled={isSubmitting}
                    className="shrink-0"
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {formData.category && !isAddingNewCategory && (
                <p className="text-xs text-gray-500">
                  Selected:{" "}
                  <span className="font-medium">{formData.category}</span>
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal-black">
              Product Images <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                if (!files.length) return;

                setIsUploadingImage(true);

                try {
                  const uploadedImages: string[] = [];
                  const uploadedPublicIds: string[] = [];

                  for (const file of files) {
                    const fd = new FormData();
                    fd.append("file", file);
                    fd.append("folder", "honeyfoods/products");

                    const res = await fetch("/api/upload", {
                      method: "POST",
                      body: fd,
                    });

                    if (!res.ok) {
                      const err = await res.json();
                      throw new Error(err.error || "Upload failed");
                    }

                    const data = await res.json();
                    uploadedImages.push(data.url);
                    if (data.publicId) {
                      uploadedPublicIds.push(data.publicId);
                    }
                  }

                  // Set the first image as the main image if not already set
                  const mainImage = formData.image || uploadedImages[0];

                  setFormData({
                    ...formData,
                    image: mainImage,
                    images: [...formData.images, ...uploadedImages],
                    imagePublicIds: [
                      ...formData.imagePublicIds,
                      ...uploadedPublicIds,
                    ],
                  });
                } catch (err) {
                  console.error("Upload error:", err);
                  alert("Image upload failed. Please try again.");
                } finally {
                  setIsUploadingImage(false);
                }
              }}
              disabled={isSubmitting || isUploadingImage}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-honey-gold file:text-white hover:file:bg-warm-orange disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Upload Loading State */}
            {isUploadingImage && (
              <div className="mt-3 flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-honey-gold"></div>
                <span className="text-sm text-blue-700 font-medium">
                  Uploading images...
                </span>
              </div>
            )}

            {/* Image Preview Grid */}
            {formData.images.length > 0 && !isUploadingImage && (
              <div className="mt-3">
                <div className="grid grid-cols-3 gap-3">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.images.filter(
                            (_, i) => i !== index,
                          );
                          const newPublicIds = formData.imagePublicIds.filter(
                            (_, i) => i !== index,
                          );
                          setFormData({
                            ...formData,
                            images: newImages,
                            imagePublicIds: newPublicIds,
                            image: newImages[0] || "",
                          });
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <Badge className="absolute bottom-1 left-1 text-xs bg-honey-gold">
                          Main
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-green-600 mt-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {formData.images.length} image
                    {formData.images.length > 1 ? "s" : ""} uploaded
                  </span>
                </div>
              </div>
            )}

            {formData.images.length === 0 && !isUploadingImage && (
              <p className="mt-2 text-xs text-gray-500">
                Required. Upload one or more product images. The first image
                will be used as the main image.
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 px-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">
                  Product Visibility
                </h4>
                <p className="text-sm text-gray-500">
                  Choose where this product will appear
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="productType"
                  checked={formData.featured && !formData.available}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        featured: true,
                        available: false,
                      });
                    }
                  }}
                  disabled={isSubmitting}
                  className="mt-0.5 h-4 w-4 text-honey-gold focus:ring-honey-gold"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Featured Product
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Will appear in the "Our Menu" section on homepage only
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="productType"
                  checked={formData.available && !formData.featured}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        available: true,
                        featured: false,
                      });
                    }
                  }}
                  disabled={isSubmitting}
                  className="mt-0.5 h-4 w-4 text-honey-gold focus:ring-honey-gold"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Shop Product
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Will appear in the shop page for customers to purchase
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting || isUploadingImage}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                isUploadingImage ||
                (editingProduct ? false : !isFormValid())
              }
              className="flex-1"
            >
              {isSubmitting
                ? editingProduct
                  ? "Updating..."
                  : "Adding..."
                : isUploadingImage
                  ? "Uploading image..."
                  : editingProduct
                    ? "Update Product"
                    : "Add Product"}
            </Button>
          </div>
        </form>
      </Modal>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Delete Product
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-4">
              <p className="font-medium text-charcoal-black">
                Are you sure you want to delete "{productToDelete?.name}"?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2">
                <p className="text-sm text-red-800 font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Warning: This action cannot be undone!
                </p>
                <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                  <li>The product will be permanently deleted</li>
                  <li>This action is irreversible</li>
                  <li>Product data cannot be recovered</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setProductToDelete(null);
              }}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Permanently
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
