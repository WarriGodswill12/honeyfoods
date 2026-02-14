"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Store, Truck, Save, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const settings = useQuery(api.settings.getSettings);
  const updateSettings = useMutation(api.settings.updateSettings);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    deliveryFee: 0,
    freeDeliveryThreshold: 0,
    freeDeliveryText: "",
    minOrderAmount: 0,
  });

  // Update form data when settings load
  useEffect(() => {
    if (settings) {
      setFormData({
        deliveryFee: settings.deliveryFee || 0,
        freeDeliveryThreshold: settings.freeDeliveryThreshold || 0,
        freeDeliveryText: (settings as any).freeDeliveryText || "",
        minOrderAmount: (settings as any).minOrderAmount || 0,
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    // Save in pounds directly
    const payload = {
      deliveryFee: formData.deliveryFee,
      freeDeliveryThreshold: formData.freeDeliveryThreshold,
      freeDeliveryText: formData.freeDeliveryText,
      minOrderAmount: formData.minOrderAmount,
    };

    try {
      await updateSettings({
        deliveryFee: payload.deliveryFee,
        freeDeliveryThreshold: payload.freeDeliveryThreshold,
        freeDeliveryText: payload.freeDeliveryText,
        minOrderAmount: payload.minOrderAmount,
      });

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
      [field]: field === "freeDeliveryText" ? value : parseFloat(value) || 0,
    }));
  };

  if (settings === undefined) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <LoadingSpinner />
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
              <Input value={(settings as any)?.storeTagline || ""} disabled />
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
                Current: £{(formData.deliveryFee || 0).toFixed(2)}
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
                Orders over £{(formData.freeDeliveryThreshold || 0).toFixed(2)}{" "}
                get free delivery
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Free Delivery Message
              </label>
              <Input
                type="text"
                value={formData.freeDeliveryText}
                onChange={(e) =>
                  handleChange("freeDeliveryText", e.target.value)
                }
                placeholder="Add £{amount} more for free delivery!"
                maxLength={150}
              />
              <p className="text-sm text-gray-500 mt-1">
                Custom message shown to customers. Use {"{amount}"} as
                placeholder for the remaining amount. Default: "Add £
                {"{amount}"} more for free delivery!"
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
                Minimum order value: £
                {(formData.minOrderAmount || 0).toFixed(2)}
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
