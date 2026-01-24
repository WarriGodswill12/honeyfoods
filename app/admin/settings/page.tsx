"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, Truck, Save, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Settings {
  id: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  minOrderAmount: number;
  storeName: string;
  storeTagline: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeCity: string;
  storePostalCode: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    deliveryFee: 0,
    freeDeliveryThreshold: 0,
    minOrderAmount: 0,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (!response.ok) throw new Error("Failed to fetch settings");

      const data = await response.json();
      setSettings(data);
      setFormData({
        deliveryFee: data.deliveryFee / 100, // convert to pounds for display
        freeDeliveryThreshold: data.freeDeliveryThreshold / 100, // convert to pounds for display
        minOrderAmount: data.minOrderAmount / 100, // convert to pounds for display
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      setMessage({ type: "error", text: "Failed to load settings" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    // Convert pounds to pence before saving
    const payload = {
      deliveryFee: Math.round(formData.deliveryFee * 100),
      freeDeliveryThreshold: Math.round(formData.freeDeliveryThreshold * 100),
      minOrderAmount: Math.round(formData.minOrderAmount * 100),
    };

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save settings");
      }

      const updated = await response.json();
      setSettings(updated);
      setMessage({ type: "success", text: "Settings saved successfully!" });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error("Error saving settings:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to save settings",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold text-charcoal-black mb-2">
          Settings
        </h1>
        <p className="text-gray-600">
          Manage your store delivery and pricing settings
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <AlertCircle className="h-5 w-5" />
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Store Information (Read-only) */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-honey-gold/10 rounded-lg">
              <Store className="h-5 w-5 text-honey-gold" />
            </div>
            <h2 className="font-heading text-xl font-bold text-charcoal-black">
              Store Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Name
              </label>
              <Input value={settings?.storeName || ""} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tagline
              </label>
              <Input value={settings?.storeTagline || ""} disabled />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input value={settings?.storeEmail || ""} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <Input value={settings?.storePhone || ""} disabled />
              </div>
            </div>
          </div>
        </Card>

        {/* Delivery Settings (Editable) */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-warm-orange/10 rounded-lg">
              <Truck className="h-5 w-5 text-warm-orange" />
            </div>
            <h2 className="font-heading text-xl font-bold text-charcoal-black">
              Delivery & Pricing Settings
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Fee (GBP £)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.deliveryFee}
                onChange={(e) => handleChange("deliveryFee", e.target.value)}
                placeholder="15.00"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Current: {formatPrice(formData.deliveryFee)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Free Delivery Threshold (GBP £)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.freeDeliveryThreshold}
                onChange={(e) =>
                  handleChange("freeDeliveryThreshold", e.target.value)
                }
                placeholder="100.00"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Orders over {formatPrice(formData.freeDeliveryThreshold)} get
                free delivery
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Order Amount (GBP £)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.minOrderAmount}
                onChange={(e) => handleChange("minOrderAmount", e.target.value)}
                placeholder="5.00"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum order value: {formatPrice(formData.minOrderAmount)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
