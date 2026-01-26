"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function SeedPage() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const seedProducts = useMutation(api.seed.seedProducts);
  const seedSettings = useMutation(api.seed.seedSettings);

  const runSeed = async () => {
    setLoading(true);
    try {
      // Seed settings
      setStatus("Creating default settings...");
      const settings = await seedSettings();
      console.log(settings);

      // Seed products
      setStatus("Seeding products...");
      const products = await seedProducts();
      console.log(products);

      setStatus(`✅ Seed complete! ${products.count} products created.`);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Database Seed</h1>
        <p className="text-gray-600 mb-6">
          Click the button below to seed your Convex database with initial
          products and settings.
        </p>

        <button
          onClick={runSeed}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? "Seeding..." : "Run Seed"}
        </button>

        {status && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm whitespace-pre-wrap">{status}</p>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p>
            <strong>Note:</strong> Admin users should be created via NextAuth.
          </p>
          <p className="mt-2 text-xs text-blue-600">
            This will seed 24 products and default settings (£5 delivery fee).
          </p>
        </div>
      </div>
    </div>
  );
}
