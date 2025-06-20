import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar"; // ✅ Import the Navbar
// import { Orbitron } from 'next/font/google';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Simulatica",
  description: "CFD & Simulation Service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar /> {/* ✅ Add Navbar here */}
          <main className="pt-4">{children}</main>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
