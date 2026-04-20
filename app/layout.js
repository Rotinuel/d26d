import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/hooks/useAuth";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata = {
  title: {
<<<<<<< HEAD
    default: "Olambe Detty December Carnival 2026",
    template: "%s | ODDC 2026",
  },
  description:
    "Nigeria's most anticipated December celebration. Four days of music, culture, food, and unforgettable memories. Dec 23–26, 2026 · Olambe, Ogun State.",
  keywords: ["Olambe", "Detty December", "Carnival", "Nigeria", "Festival", "Lagos", "Ogun State"],
  openGraph: {
    title: "Olambe Detty December Carnival 2026",
=======
    default: "Olambe Detty December Carnival 2025",
    template: "%s | ODDC 2025",
  },
  description:
    "Nigeria's most anticipated December celebration. Four days of music, culture, food, and unforgettable memories. Dec 23–26, 2025 · Olambe, Ogun State.",
  keywords: ["Olambe", "Detty December", "Carnival", "Nigeria", "Festival", "Lagos", "Ogun State"],
  openGraph: {
    title: "Olambe Detty December Carnival 2025",
>>>>>>> e1d658b01c6caaf9506d7b7dfaf871069195ae70
    description: "Dec 23–26 · Olambe, Ogun State, Nigeria",
    type: "website",
    locale: "en_NG",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Paystack inline script */}
        <script src="https://js.paystack.co/v1/inline.js" async />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
