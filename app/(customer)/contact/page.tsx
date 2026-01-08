"use client";

import { siteConfig } from "@/config/site";
import { Mail, Phone, MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, FormEvent } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  FadeIn,
  SlideInLeft,
  SlideInRight,
} from "@/components/shared/animated";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const subject = `Contact Form: Message from ${formData.name}`;
    const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0APhone: ${formData.phone}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;

    window.location.href = `mailto:${
      siteConfig.contact.email
    }?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">Contact</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <FadeIn className="mb-8 sm:mb-10 lg:mb-12 text-center">
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-black">
          Get in Touch
        </h1>
        <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg text-gray-600 px-4">
          Have a question or special request? We'd love to hear from you!
        </p>
      </FadeIn>

      <div className="grid gap-8 sm:gap-10 lg:gap-12 lg:grid-cols-2">
        {/* Contact Form */}
        <SlideInLeft>
          <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-sm">
            <h2 className="font-heading mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold text-charcoal-black">
              Send us a Message
            </h2>

            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-charcoal-black"
                >
                  Your Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-charcoal-black"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-charcoal-black"
                >
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-charcoal-black"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <Button
                type="submit"
                className="w-full active:scale-[0.98]"
                size="lg"
              >
                Send Message
              </Button>
            </form>
          </div>
        </SlideInLeft>

        {/* Contact Information */}
        <SlideInRight className="space-y-6 sm:space-y-8">
          {/* Contact Cards */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm">
            <div className="mb-6 sm:mb-8">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal-black">
                Contact Information
              </h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                Reach out to us through any of these channels
              </p>
            </div>

            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-honey-gold/10">
                  <Phone className="h-6 w-6 text-honey-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-black">Phone</h3>
                  <p className="mt-1 text-gray-600">
                    {siteConfig.contact.phone}
                  </p>
                  <p className="text-sm text-gray-500">Mon-Sat, 8am-8pm</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-honey-gold/10">
                  <Mail className="h-6 w-6 text-honey-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-black">Email</h3>
                  <p className="mt-1 text-gray-600">
                    {siteConfig.contact.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    We reply within 24 hours
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-honey-gold/10">
                  <MapPin className="h-6 w-6 text-honey-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-black">
                    Location
                  </h3>
                  <p className="mt-1 text-gray-600">
                    {siteConfig.contact.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SlideInRight>
      </div>
    </div>
  );
}
