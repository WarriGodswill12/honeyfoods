"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Save,
  X,
  LayoutDashboard,
} from "lucide-react";

interface GalleryImage {
  id: number;
  type: "hero" | "gallery";
  url: string;
  alt: string;
  order: number;
}

export default function GalleryManagement() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({
    type: "gallery" as "hero" | "gallery",
    url: "",
    alt: "",
    order: 0,
  });

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = () => {
    // Load from localStorage for now
    const stored = localStorage.getItem("galleryImages");
    if (stored) {
      setImages(JSON.parse(stored));
    } else {
      // Initialize with current images
      const defaultImages: GalleryImage[] = [
        {
          id: 1,
          type: "hero",
          url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1920&q=80",
          alt: "Jollof Rice",
          order: 1,
        },
        {
          id: 2,
          type: "hero",
          url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&q=80",
          alt: "Custom Cakes",
          order: 2,
        },
        {
          id: 3,
          type: "hero",
          url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80",
          alt: "Fresh Pastries",
          order: 3,
        },
        {
          id: 4,
          type: "hero",
          url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=80",
          alt: "Party Platter",
          order: 4,
        },
        {
          id: 5,
          type: "gallery",
          url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
          alt: "Delicious Jollof Rice",
          order: 1,
        },
        {
          id: 6,
          type: "gallery",
          url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
          alt: "Beautiful Custom Cake",
          order: 2,
        },
      ];
      localStorage.setItem("galleryImages", JSON.stringify(defaultImages));
      setImages(defaultImages);
    }
  };

  const saveImages = (updatedImages: GalleryImage[]) => {
    localStorage.setItem("galleryImages", JSON.stringify(updatedImages));
    setImages(updatedImages);
  };

  const openAddModal = () => {
    setEditingImage(null);
    setFormData({
      type: "gallery",
      url: "",
      alt: "",
      order: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      type: image.type,
      url: image.url,
      alt: image.alt,
      order: image.order,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingImage) {
      // Update existing image
      const updated = images.map((img) =>
        img.id === editingImage.id ? { ...img, ...formData } : img
      );
      saveImages(updated);
    } else {
      // Add new image
      const newImage: GalleryImage = {
        id: Date.now(),
        ...formData,
      };
      saveImages([...images, newImage]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      const updated = images.filter((img) => img.id !== id);
      saveImages(updated);
    }
  };

  const heroImages = images
    .filter((img) => img.type === "hero")
    .sort((a, b) => a.order - b.order);
  const galleryImages = images
    .filter((img) => img.type === "gallery")
    .sort((a, b) => a.order - b.order);

  return (
    <div className="p-6 max-w-7xl mx-auto">
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
              <BreadcrumbPage className="font-semibold">Gallery</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-charcoal-black">
            Gallery Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage hero slider and gallery slideshow images
          </p>
        </div>
        <Button onClick={openAddModal} size="lg" className="font-semibold">
          <Plus className="mr-2 h-5 w-5" />
          Add Image
        </Button>
      </div>

      {/* Hero Slider Images */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold font-heading text-charcoal-black mb-6">
          Hero Slider Images ({heroImages.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {heroImages.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="aspect-video relative">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-white">
                <p className="font-semibold text-sm text-charcoal-black mb-1 truncate">
                  {image.alt}
                </p>
                <p className="text-xs text-gray-500">Order: {image.order}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => openEditModal(image)}
                  className="shadow-lg"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(image.id)}
                  className="shadow-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Slideshow Images */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-charcoal-black mb-6">
          Gallery Slideshow Images ({galleryImages.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="aspect-square relative">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-white">
                <p className="font-semibold text-sm text-charcoal-black mb-1 truncate">
                  {image.alt}
                </p>
                <p className="text-xs text-gray-500">Order: {image.order}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => openEditModal(image)}
                  className="shadow-lg"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(image.id)}
                  className="shadow-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold font-heading text-charcoal-black">
                  {editingImage ? "Edit Image" : "Add New Image"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type">Image Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "hero" | "gallery") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select image type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero Slider</SelectItem>
                    <SelectItem value="gallery">Gallery Slideshow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Image URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-gray-500">
                  Use Unsplash or Cloudinary URLs for best performance
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alt">Alt Text / Description</Label>
                <Input
                  id="alt"
                  type="text"
                  placeholder="Beautiful Custom Cake"
                  value={formData.alt}
                  onChange={(e) =>
                    setFormData({ ...formData, alt: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  min="0"
                  placeholder="1"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
                <p className="text-xs text-gray-500">
                  Lower numbers appear first
                </p>
              </div>

              {formData.url && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={formData.url}
                      alt={formData.alt || "Preview"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/800x450?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 font-semibold"
                >
                  <Save className="mr-2 h-5 w-5" />
                  {editingImage ? "Update Image" : "Add Image"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
