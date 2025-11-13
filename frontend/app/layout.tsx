import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";
import { MobileNav } from "@/components/mobile-nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Z-Homes - Find Your Perfect Home",
  description: "Discover rooms, flats, PG, and commercial properties in your city",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased`}
      >
        <Providers>
          {children}
          <MobileNav />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#0B132B',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(11, 19, 43, 0.06)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
