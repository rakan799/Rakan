import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "كافي فالهلا - Safwan Cafe",
  description: "موقع كافي فالهلا لإدارة الطاولات والطلبات",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
