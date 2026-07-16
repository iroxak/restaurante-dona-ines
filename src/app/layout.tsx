import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Restaurante Doña Inés | Comida Casera y Colaciones Empresariales",
  description:
    "Restaurante Doña Inés en El Melón, Nogales. Comida casera chilena, colaciones empresariales, desayunos, almuerzos, cenas y catering para eventos especiales.",
  keywords: [
    "restaurante",
    "comida casera",
    "colaciones empresariales",
    "catering",
    "El Melón",
    "Nogales",
    "Valparaíso",
    "Doña Inés",
  ],
  authors: [{ name: "Restaurante Doña Inés" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Restaurante Doña Inés",
    description:
      "Comida casera con sazón de hogar, colaciones empresariales y eventos.",
    type: "website",
    images: [{ url: "/foto1.jpg", width: 1200, height: 630, alt: "Restaurante Doña Inés" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href="/logo.png"
          type="image/png"
        />
      </head>
      <body
        className={`${playfair.variable} ${lora.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}