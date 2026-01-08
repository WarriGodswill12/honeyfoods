"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    // Allow access to login page
    if (pathname === "/admin/login") return;

    // Redirect to login if not authenticated
    if (!session) {
      router.push(`/admin/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [session, status, router, pathname]);

  // Show loading or nothing while checking auth
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-honey-gold"></div>
      </div>
    );
  }

  // Allow login page (no header)
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show content with header if authenticated
  if (session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main>{children}</main>
      </div>
    );
  }

  return null;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminGuard>{children}</AdminGuard>
    </SessionProvider>
  );
}
