"use client";

import { useState, useEffect } from "react";
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
import Image from "next/image";
import type { Product } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    featured: false,
    available: true,
    sizes: "" as string,
  });

  // Check if form is valid for submission
  const isFormValid = () => {
    const hasRequiredFields =
      formData.name.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.price !== "" &&
      formData.category.trim() !== "" &&
      formData.image.trim() !== "";

    return hasRequiredFields && !isUploadingImage;
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      featured: false,
      available: true,
      sizes: "",
    });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      featured: product.featured,
      available: product.available,
      sizes: "",
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products";

      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save product");
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete product");
      }

      setDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearAll = async () => {
    setIsClearing(true);

    try {
      const response = await fetch("/api/products/clear", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to clear products");
      }

      setIsClearDialogOpen(false);
      fetchProducts();
      alert(data.message);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsClearing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-8">
      {" "}
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard">
                <LayoutDashboard className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
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
      {filteredProducts.length === 0 ? (
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
            <Card key={product.id} className="overflow-hidden">
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
                    {formatPrice(product.price)}
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

            <Input
              label="Category"
              placeholder="e.g. Cakes"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Input
              label="Sizes/Variants (Optional)"
              placeholder="e.g. 1L, 2L, 5L or Small, Medium, Large or 6 Inch, 8 Inch, 10 Inch"
              value={formData.sizes}
              onChange={(e) =>
                setFormData({ ...formData, sizes: e.target.value })
              }
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple sizes with commas. Leave empty if product has no
              size variations.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal-black">
              Product Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const fd = new FormData();
                fd.append("file", file);
                fd.append("folder", "honeyfoods/products");

                setIsUploadingImage(true);

                try {
                  const res = await fetch("/api/upload", {
                    method: "POST",
                    body: fd,
                  });
                  if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || "Upload failed");
                  }
                  const data = await res.json();
                  setFormData({ ...formData, image: data.url });
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
                  Uploading image...
                </span>
              </div>
            )}

            {/* Image Preview */}
            {formData.image && !isUploadingImage && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-24 w-24 object-cover rounded-md border"
                />
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Image uploaded successfully
                  </span>
                </div>
              </div>
            )}

            {!formData.image && !isUploadingImage && (
              <p className="mt-2 text-xs text-gray-500">
                Required. Please upload a product image before submitting.
              </p>
            )}
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                disabled={isSubmitting}
                className="h-5 w-5 rounded border-gray-300 text-honey-gold focus:ring-honey-gold"
              />
              <span className="text-sm text-gray-700">Featured Product</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) =>
                  setFormData({ ...formData, available: e.target.checked })
                }
                disabled={isSubmitting}
                className="h-5 w-5 rounded border-gray-300 text-honey-gold focus:ring-honey-gold"
              />
              <span className="text-sm text-gray-700">Available</span>
            </label>
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
