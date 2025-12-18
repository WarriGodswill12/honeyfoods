"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AdminRootPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      router.push("/admin/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-soft-cream flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
