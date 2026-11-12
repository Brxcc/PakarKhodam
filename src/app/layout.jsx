import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "PakarKhodam — Sistem Pakar Diagnosis Kesehatan Mental",
  description: "Terawang dini kondisi kesehatan mental menggunakan metode Forward Chaining dan Teorema Bayes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
