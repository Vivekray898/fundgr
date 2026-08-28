// app/(client)/layout.tsx
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWrapper />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}