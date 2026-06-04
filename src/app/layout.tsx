import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "КиберСтраж | Колледж ЛОГОС",
  description:
    "КиберСтраж — летняя программа по информационной безопасности в техническом колледже «ЛОГОС»",
  icons: {
    icon: [
      {
        url: "/cropped-favicon-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
    ],
    apple: "/cropped-favicon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${montserrat.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
