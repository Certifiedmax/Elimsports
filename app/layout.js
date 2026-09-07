
import "./globals.css";
import TopAnnouncementBar from "@/components/TopAnnouncementBar";
import { CartProvider } from "./CartContext";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Apex Sports | Authentic Tournament Rackets Kenya",
  description: "Official Yonex, Victor, and Li-Ning equipment with pro stringing in Nairobi.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 min-h-screen">
        <CartProvider>
          <TopAnnouncementBar />
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}