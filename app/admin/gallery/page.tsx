"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
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
  AlertCircle,
} from "lucide-react";

interface GalleryImage {
  id: string;
  type: "hero" | "gallery";
  url: string;
  alt: string;
  featured: boolean;
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
    featured: false,
    order: 0,
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Settings images
  const [heroBackgroundImage, setHeroBackgroundImage] = useState("");
  const [aboutUsImage, setAboutUsImage] = useState("");
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadImages();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (!response.ok) throw new Error("Failed to fetch settings");

      const data = await response.json();
      setHeroBackgroundImage(data.heroBackgroundImage || "");
      setAboutUsImage(data.aboutUsImage || "");
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    setSettingsMessage(null);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroBackgroundImage,
          aboutUsImage,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save settings");
      }

      setSettingsMessage({
        type: "success",
        text: "Images saved successfully!",
      });
      setTimeout(() => setSettingsMessage(null), 3000);
    } catch (error: any) {
      console.error("Error saving settings:", error);
      setSettingsMessage({
        type: "error",
        text: error.message || "Failed to save images",
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const loadImages = async () => {
    try {
      const response = await fetch("/api/gallery");
      if (!response.ok) throw new Error("Failed to fetch gallery images");
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    }
  };

  const saveImages = (updatedImages: GalleryImage[]) => {
    setImages(updatedImages);
  };

  const openAddModal = () => {
    setEditingImage(null);
    setFormData({
      type: "gallery",
      url: "",
      alt: "",
      featured: false,
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
      featured: image.featured,
      order: image.order,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingImage) {
        // Update existing image
        const response = await fetch(`/api/gallery/${editingImage.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to update image");
        const updated = await response.json();
        const newImages = images.map((img) =>
          img.id === editingImage.id ? updated : img
        );
        saveImages(newImages);
      } else {
        // Add new image
        const response = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to create image");
        const newImage = await response.json();
        saveImages([...images, newImage]);
      }

      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving image:", error);
      alert(error.message || "Failed to save image");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        const response = await fetch(`/api/gallery/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete image");
        const updated = images.filter((img) => img.id !== id);
        saveImages(updated);
      } catch (error: any) {
        console.error("Error deleting image:", error);
        alert(error.message || "Failed to delete image");
      }
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
            Manage page images, hero slider and gallery slideshow
          </p>
        </div>
        <Button onClick={openAddModal} size="lg" className="font-semibold">
          <Plus className="mr-2 h-5 w-5" />
          Add Image
        </Button>
      </div>

      {/* Settings Images Section */}
      <Card className="p-6 mb-8">
        <div className="mb-6">
          <h2 className="font-heading text-2xl font-bold text-charcoal-black mb-2">
            Page Images
          </h2>
          <p className="text-gray-600">
            Manage hero background and about us page images
          </p>
        </div>

        {settingsMessage && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              settingsMessage.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <AlertCircle className="h-5 w-5" />
            <span>{settingsMessage.text}</span>
          </div>
        )}

        {isLoadingSettings ? (
          <div className="text-center py-8 text-gray-500">
            Loading images...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Hero Background Image */}
            <div className="border-b pb-6">
              <Label className="text-lg font-semibold mb-3 block">
                Hero Background Image
              </Label>
              <p className="text-sm text-gray-500 mb-4">
                This image appears as the background on the homepage hero
                section
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("folder", "honeyfoods/hero");

                  try {
                    setIsSavingSettings(true);
                    const response = await fetch("/api/upload", {
                      method: "POST",
                      body: formData,
                    });

                    if (!response.ok) {
                      const error = await response.json();
                      throw new Error(error.error);
                    }

                    const data = await response.json();
                    setHeroBackgroundImage(data.url);
                    setSettingsMessage({
                      type: "success",
                      text: "Image uploaded! Click Save to apply.",
                    });
                    setTimeout(() => setSettingsMessage(null), 3000);
                  } catch (error: any) {
                    setSettingsMessage({
                      type: "error",
                      text: error.message || "Upload failed",
                    });
                  } finally {
                    setIsSavingSettings(false);
                  }
                }}
                className="mb-3"
              />
              {heroBackgroundImage && (
                <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={heroBackgroundImage}
                    alt="Hero Background Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/800x450?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              )}
            </div>

            {/* About Us Image */}
            <div className="pb-6">
              <Label className="text-lg font-semibold mb-3 block">
                About Us Section Image
              </Label>
              <p className="text-sm text-gray-500 mb-4">
                This image appears in the "Welcome to Honey Foods" section on
                the homepage and about page
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("folder", "honeyfoods/about");

                  try {
                    setIsSavingSettings(true);
                    const response = await fetch("/api/upload", {
                      method: "POST",
                      body: formData,
                    });

                    if (!response.ok) {
                      const error = await response.json();
                      throw new Error(error.error);
                    }

                    const data = await response.json();
                    setAboutUsImage(data.url);
                    setSettingsMessage({
                      type: "success",
                      text: "Image uploaded! Click Save to apply.",
                    });
                    setTimeout(() => setSettingsMessage(null), 3000);
                  } catch (error: any) {
                    setSettingsMessage({
                      type: "error",
                      text: error.message || "Upload failed",
                    });
                  } finally {
                    setIsSavingSettings(false);
                  }
                }}
                className="mb-3"
              />
              {aboutUsImage && (
                <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={aboutUsImage}
                    alt="About Us Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/800x450?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              )}
            </div>

            <Button
              onClick={handleSaveSettings}
              disabled={isSavingSettings}
              size="lg"
              className="w-full sm:w-auto"
            >
              {isSavingSettings ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Save Page Images
                </>
              )}
            </Button>
          </div>
        )}
      </Card>

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
                {image.featured && (
                  <div className="absolute top-2 left-2 bg-honey-gold text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    ⭐ Featured
                  </div>
                )}
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
                <Label htmlFor="file">Upload Image</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const formDataUpload = new FormData();
                    formDataUpload.append("file", file);
                    formDataUpload.append(
                      "folder",
                      `honeyfoods/${formData.type}`
                    );

                    try {
                      setIsUploadingImage(true);
                      const response = await fetch("/api/upload", {
                        method: "POST",
                        body: formDataUpload,
                      });

                      if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error);
                      }

                      const data = await response.json();
                      setFormData({ ...formData, url: data.url });
                    } catch (error: any) {
                      alert(
                        error.message || "Upload failed. Please try again."
                      );
                    } finally {
                      setIsUploadingImage(false);
                    }
                  }}
                  disabled={isUploadingImage}
                  required={!formData.url}
                />
                {isUploadingImage && (
                  <p className="text-xs text-blue-600">Uploading image...</p>
                )}
                <p className="text-xs text-gray-500">
                  Upload JPEG, PNG, or WebP images (max 10MB)
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

              {formData.type === "gallery" && (
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border-2 border-honey-gold/20 rounded-lg hover:bg-honey-gold/5 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          featured: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-gray-300 text-honey-gold focus:ring-honey-gold"
                    />
                    <div>
                      <p className="font-semibold text-charcoal-black">
                        Featured Photo
                      </p>
                      <p className="text-xs text-gray-600">
                        Featured photos will be displayed in the homepage slider
                      </p>
                    </div>
                  </label>
                </div>
              )}

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
                  disabled={isUploadingImage || !formData.url}
                >
                  <Save className="mr-2 h-5 w-5" />
                  {editingImage ? "Update Image" : "Add Image"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isUploadingImage}
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
