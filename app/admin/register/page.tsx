"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function AdminRegisterPage() {
  const router = useRouter();
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Register using Convex Auth (which creates account automatically)
      setSuccess("Creating account...");

      await signIn("password", {
        email,
        password,
        flow: "signUp",
      });

      setSuccess("Registration successful! Redirecting...");

      // Redirect to admin dashboard
      setTimeout(() => {
        router.push("/admin/dashboard");
        router.refresh();
      }, 1000);
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt="HoneyFoods Logo"
              width={240}
              height={240}
              className="h-28 w-auto sm:h-32"
              priority
            />
          </div>
          <h1 className="font-heading text-4xl font-bold text-charcoal-black">
            Honey<span className="text-honey-gold">Foods</span>
          </h1>
          <p className="mt-2 text-warm-orange font-medium tracking-wider uppercase text-sm">
            Admin Registration
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white p-10 rounded-3xl">
          <h2 className="font-heading text-2xl font-bold text-charcoal-black mb-8">
            Create Admin Account
          </h2>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />

            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <Input
              type="password"
              label="Password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={8}
            />

            <Button
              type="submit"
              className="w-full bg-honey-gold hover:bg-honey-gold/90 text-white font-semibold py-6 text-base"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Admin Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/admin/login"
                className="text-honey-gold hover:underline font-medium"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
