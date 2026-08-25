import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "College by College — U.S. Higher Education",
    template: "%s — College by College",
  },
  description:
    "An unsupervised learning exploration of 1,302 US colleges and universities.",
  openGraph: {
    title: "College by College — U.S. Higher Education",
    description: "1,302 institutions, 35 variables and three models exploring what shapes a university.",
    images: [{
      url: "/og.png",
      width: 1200,
      height: 630,
      alt: "College by College — U.S. Higher Education",
    }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "College by College — U.S. Higher Education",
    description: "1,302 institutions, 35 variables and three models exploring what shapes a university.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${sans.variable} ${serif.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
