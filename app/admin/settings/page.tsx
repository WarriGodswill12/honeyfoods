"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, Mail, Phone, MapPin } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold text-charcoal-black mb-2">
          Settings
        </h1>
        <p className="text-gray-600">
          Manage your store settings and preferences
        </p>
      </div>

      {/* Store Information */}
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
          <Input label="Store Name" value="HoneyFoods" disabled />
          <Input label="Tagline" value="Taste is everything" disabled />
          <Input
            label="Email"
            type="email"
            value="info@honeyfoods.com"
            disabled
          />
          <Input label="Phone" type="tel" value="+234 123 456 7890" disabled />
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-warm-orange/10 rounded-lg">
            <MapPin className="h-5 w-5 text-warm-orange" />
          </div>
          <h2 className="font-heading text-xl font-bold text-charcoal-black">
            Contact Information
          </h2>
        </div>

        <div className="space-y-4">
          <Input
            label="Address"
            value="123 Main Street, Lagos, Nigeria"
            disabled
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" value="Lagos" disabled />
            <Input label="Postal Code" value="100001" disabled />
          </div>
        </div>
      </Card>

      {/* Delivery Settings */}
      <Card className="p-6">
        <h2 className="font-heading text-xl font-bold text-charcoal-black mb-6">
          Delivery Settings
        </h2>

        <div className="space-y-4">
          <Input label="Delivery Fee (₦)" type="number" value="1000" disabled />
          <Input
            label="Free Delivery Threshold (₦)"
            type="number"
            value="10000"
            disabled
          />
        </div>
      </Card>

      <div className="mt-6 text-center text-sm text-gray-500">
        Settings management will be enabled in a future update
      </div>
    </div>
  );
}
