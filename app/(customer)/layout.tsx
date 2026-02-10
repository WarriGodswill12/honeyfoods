import { Header } from "@/components/customer/header";
import { Footer } from "@/components/customer/footer";
import { Toaster } from "@/components/ui/sonner";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster position="bottom-center" />
    </div>
  );
}
