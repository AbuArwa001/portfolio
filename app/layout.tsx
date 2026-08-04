import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from "./NavBar";
import PageTransition from "./PageTransition";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Khalfan Athman — Network Engineer & Full-Stack Developer",
  description:
    "Senior Network Engineer with 6+ years of experience, specialising in Django REST Framework APIs and Next.js frontends. Based in Nairobi, Kenya.",
  keywords: [
    "Khalfan Athman",
    "Network Engineer",
    "Full Stack Developer",
    "Django",
    "Next.js",
    "Nairobi",
    "Kenya",
  ],
  authors: [{ name: "Khalfan Athman", url: "https://www.khalfanathman.dev" }],
  openGraph: {
    type: "website",
    title: "Khalfan Athman — Network Engineer & Full-Stack Developer",
    description:
      "Senior Network Engineer specialising in Django REST Framework and Next.js. Building production systems that scale.",
    siteName: "Khalfan Athman",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <NavBar />
            <PageTransition>
              <main className="flex-1">{children}</main>
            </PageTransition>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
