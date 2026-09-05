import "./globals.css";
import { portfolioContent } from "@/utils/data/portfolioContent";

const { seo } = portfolioContent;

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || seo.url),
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  openGraph: {
    title: seo.title,
    description: seo.description,
    type: "website",
    images: [
      {
        url: seo.image,
        width: 1200,
        height: 630,
        alt: "Terminal style portfolio background",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: [seo.image],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
