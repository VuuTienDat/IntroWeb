import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { company, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: company.name,
  category: "technology",
  referrer: "origin-when-cross-origin",
  title: {
    default: "Bee System Việt Nam — Phần mềm y tế và điều dưỡng",
    template: "%s | Bee System Việt Nam",
  },
  description: company.description,
  keywords: [
    "phần mềm y tế",
    "phần mềm điều dưỡng",
    "xếp lịch điều dưỡng",
    "chuyển đổi số y tế",
    "Bee System Việt Nam",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: company.name,
    title: "Bee System Việt Nam — Phần mềm y tế và điều dưỡng",
    description: company.description,
    url: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: company.name,
  description: company.description,
  inLanguage: "vi-VN",
  publisher: { "@id": `${siteUrl}/#organization` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <a className="skip-link" href="#main-content">
          Chuyển đến nội dung chính
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <SiteHeader />
        <div id="main-content">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
